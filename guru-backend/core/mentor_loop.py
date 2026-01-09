"""
Guru Mentor Loop Orchestrator

Implements the 6-stage diagnostic mentorship flow:
1. Observe (user describes problem)
2. Baseline (establish what works, constraints)
3. Questions (systematically probe understanding)
4. Frame (identify problem type & root cause)
5. Guide (teach action, not just execute)
6. Reflect (extract principles for future)

Integrates with OpenWebUI's RAG pipeline for history retrieval.
"""

import logging
from typing import Dict, List, Any, Optional
from enum import Enum
import json
from datetime import datetime

log = logging.getLogger(__name__)


class MentorStage(str, Enum):
    """The 6 stages of the mentor loop."""
    OBSERVE = "observe"          # User describes the problem
    BASELINE = "baseline"        # What's working, what's not
    QUESTIONS = "questions"      # Diagnostic questions
    FRAME = "frame"              # Problem diagnosis
    GUIDE = "guide"              # Action guidance
    REFLECT = "reflect"          # Principles extraction


class DiagnosticSession:
    """Represents a single user diagnostic session."""
    
    def __init__(self, session_id: str, user_id: str, domain: str):
        self.session_id = session_id
        self.user_id = user_id
        self.domain = domain
        self.stage = MentorStage.OBSERVE
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        
        # Mentor loop state
        self.observation: Optional[str] = None
        self.baseline: Optional[Dict] = None
        self.questions: List[Dict] = []
        self.answers: Dict[str, str] = {}
        self.frame: Optional[Dict] = None
        self.guidance: List[Dict] = []
        self.reflection: Optional[str] = None
        
        # Context enrichment
        self.past_problems: List[Dict] = []
        self.relevant_docs: List[Dict] = []
        self.model_reasoning: Dict[str, Any] = {}


class MentorLoopOrchestrator:
    """
    Orchestrates the 6-stage diagnostic mentor loop.
    
    Integrates:
    - DiagnosticService (domain logic)
    - RetrievalService (history + domain knowledge)
    - LocalModelService (reasoning on device)
    - OpenWebUIAdapter (optional remote fallback)
    """
    
    def __init__(self, 
                 diagnostic_service=None,
                 retrieval_service=None,
                 model_service=None):
        """
        Initialize the mentor loop.
        
        Args:
            diagnostic_service: DiagnosticService instance
            retrieval_service: RetrievalService instance
            model_service: LocalModelService instance
        """
        self.diagnostic_service = diagnostic_service
        self.retrieval_service = retrieval_service
        self.model_service = model_service
        
        # Session storage (TODO: replace with database)
        self.sessions: Dict[str, DiagnosticSession] = {}
    
    # ========================================================================
    # STAGE 1: OBSERVE
    # ========================================================================
    
    async def stage_observe(self, session: DiagnosticSession, 
                           observation: str) -> Dict[str, Any]:
        """
        Stage 1: Record user's initial observation.
        
        Mentor's Role:
        - Listen to what the user perceives as the problem
        - Don't correct yet, just understand
        - Extract key signals (what's broken, when did it start, what's affected)
        
        Args:
            session: DiagnosticSession
            observation: User's description of the problem
            
        Returns:
            Next prompt and context
        """
        log.info(f"[{session.session_id}] OBSERVE: {observation[:100]}...")
        
        session.observation = observation
        session.stage = MentorStage.OBSERVE
        
        # Classify the problem type (via classifier)
        # This helps us index into the right domain knowledge
        problem_type = None
        if self.diagnostic_service:
            problem_type = await self.diagnostic_service.classify(
                observation, session.domain
            )
        
        # Retrieve similar past problems
        if self.retrieval_service:
            session.past_problems = await self.retrieval_service.getSimilarPastProblems(
                session.user_id, problem_type or session.domain, 5
            )
        
        # Move to next stage
        session.stage = MentorStage.BASELINE
        
        return {
            "stage": "observe",
            "status": "recorded",
            "classification": problem_type,
            "similarPastProblems": len(session.past_problems),
            "nextStage": "baseline",
            "nextPrompt": "What currently works? (Establish the baseline.)"
        }
    
    # ========================================================================
    # STAGE 2: BASELINE
    # ========================================================================
    
    async def stage_baseline(self, session: DiagnosticSession,
                            baseline_input: Dict) -> Dict[str, Any]:
        """
        Stage 2: Establish the baseline.
        
        Mentor's Role:
        - Understand what's still working (signals system is partially functional)
        - Identify constraints (can't shut down, risky to test, etc.)
        - Clarify the "scope" of the problem
        
        Args:
            session: DiagnosticSession
            baseline_input: Dict with keys like "whatWorks", "constraints", etc.
            
        Returns:
            Diagnostic questions to ask
        """
        log.info(f"[{session.session_id}] BASELINE: {baseline_input}")
        
        session.baseline = baseline_input
        session.stage = MentorStage.BASELINE
        
        # Generate diagnostic questions
        # These are designed to narrow the problem space
        if self.diagnostic_service:
            session.questions = await self.diagnostic_service.generateQuestions(
                observation=session.observation,
                baseline=session.baseline,
                domain=session.domain,
                pastProblems=session.past_problems
            )
        
        # Move to next stage
        session.stage = MentorStage.QUESTIONS
        
        return {
            "stage": "baseline",
            "status": "recorded",
            "questionsGenerated": len(session.questions),
            "nextStage": "questions",
            "questions": session.questions[:3]  # Show top 3 first
        }
    
    # ========================================================================
    # STAGE 3: QUESTIONS (Iterative)
    # ========================================================================
    
    async def stage_answer_question(self, session: DiagnosticSession,
                                   question_id: str, answer: str) -> Dict[str, Any]:
        """
        Stage 3: Record answer to a diagnostic question.
        
        Mentor's Role:
        - Listen to the answer
        - Update the mental model of the problem
        - Decide: ask more questions? Move to framing?
        
        Args:
            session: DiagnosticSession
            question_id: ID of the question being answered
            answer: User's answer
            
        Returns:
            Next question or transition to framing
        """
        log.info(f"[{session.session_id}] ANSWER[{question_id}]: {answer[:100]}...")
        
        session.answers[question_id] = answer
        session.stage = MentorStage.QUESTIONS
        
        # Update diagnostic model
        if self.diagnostic_service:
            diagnosis_update = await self.diagnostic_service.updateDiagnosis(
                observation=session.observation,
                baseline=session.baseline,
                answers=session.answers,
                domain=session.domain
            )
        
        # Decide next action
        # - If still uncertain: ask more questions
        # - If confident enough: move to frame
        
        should_move_to_frame = len(session.answers) >= 3  # Heuristic: ask 3+ questions
        
        if should_move_to_frame:
            session.stage = MentorStage.FRAME
            return {
                "status": "answered",
                "nextAction": "frame",
                "message": "I think I understand the problem now."
            }
        else:
            # Get next question
            next_question = session.questions[len(session.answers)] if len(session.answers) < len(session.questions) else None
            return {
                "status": "answered",
                "nextAction": "ask",
                "nextQuestion": next_question
            }
    
    # ========================================================================
    # STAGE 4: FRAME
    # ========================================================================
    
    async def stage_frame(self, session: DiagnosticSession) -> Dict[str, Any]:
        """
        Stage 4: Frame the problem (diagnosis).
        
        Mentor's Role:
        - Synthesize all observations into a coherent model
        - Say what the problem IS and what it ISN'T
        - Identify root cause
        - Express confidence and caveats
        
        Args:
            session: DiagnosticSession
            
        Returns:
            Diagnosis frame
        """
        log.info(f"[{session.session_id}] FRAME")
        
        session.stage = MentorStage.FRAME
        
        # Generate frame using diagnostic service
        if self.diagnostic_service:
            session.frame = await self.diagnostic_service.frameProblem(
                observation=session.observation,
                baseline=session.baseline,
                answers=session.answers,
                domain=session.domain,
                pastProblems=session.past_problems
            )
        
        log.info(f"[{session.session_id}] FRAME: {session.frame}")
        
        # Move to next stage
        session.stage = MentorStage.GUIDE
        
        return {
            "stage": "frame",
            "status": "diagnosed",
            "frame": session.frame,
            "nextStage": "guide",
            "nextPrompt": "Here's what I recommend you try first..."
        }
    
    # ========================================================================
    # STAGE 5: GUIDE
    # ========================================================================
    
    async def stage_guide(self, session: DiagnosticSession) -> Dict[str, Any]:
        """
        Stage 5: Provide guidance (action + teaching).
        
        Mentor's Role:
        - Decide what action the user should take FIRST
        - Explain WHY (teach the reasoning)
        - Set expectations (what to look for, what success looks like)
        - Warn about risks
        
        Args:
            session: DiagnosticSession
            
        Returns:
            Guided actions
        """
        log.info(f"[{session.session_id}] GUIDE")
        
        session.stage = MentorStage.GUIDE
        
        # Decide action
        if self.diagnostic_service:
            session.guidance = await self.diagnostic_service.decideAction(
                frame=session.frame,
                baseline=session.baseline,
                domain=session.domain
            )
        
        log.info(f"[{session.session_id}] GUIDANCE: {len(session.guidance)} steps")
        
        # Move to next stage (when user reports back)
        session.stage = MentorStage.REFLECT
        
        return {
            "stage": "guide",
            "status": "guided",
            "guidance": session.guidance,
            "nextStage": "reflect",
            "nextPrompt": "Try the first step and let me know what happens."
        }
    
    # ========================================================================
    # STAGE 6: REFLECT
    # ========================================================================
    
    async def stage_reflect(self, session: DiagnosticSession,
                           result: str) -> Dict[str, Any]:
        """
        Stage 6: Extract principles for future.
        
        Mentor's Role:
        - Understand the outcome of the guidance
        - If successful: extract the principle ("When you see X, do Y")
        - If unsuccessful: revise hypothesis and loop back
        - Always teach the reasoning, not just the fix
        
        Args:
            session: DiagnosticSession
            result: User's report of what happened
            
        Returns:
            Reflection and principle extraction
        """
        log.info(f"[{session.session_id}] REFLECT: {result[:100]}...")
        
        session.stage = MentorStage.REFLECT
        
        # Analyze result
        if self.diagnostic_service:
            session.reflection = await self.diagnostic_service.extractPrinciple(
                guidance=session.guidance,
                result=result,
                frame=session.frame,
                domain=session.domain
            )
        
        # Store session for future retrieval (backward loop)
        # This enriches getSimilarPastProblems for next user with same issue
        await self._store_session(session)
        
        return {
            "stage": "reflect",
            "status": "reflected",
            "principle": session.reflection,
            "nextPrompt": "That's a valuable lesson. Next time you see X, remember Y.",
            "sessionComplete": True
        }
    
    # ========================================================================
    # UTILITIES
    # ========================================================================
    
    async def _store_session(self, session: DiagnosticSession):
        """
        Store completed session in vector DB for future retrieval.
        """
        if not self.retrieval_service:
            return
        
        # Chunk the session into retrievable pieces
        chunks = [
            {
                "type": "problem",
                "content": session.observation,
                "metadata": {"sessionId": session.session_id, "domain": session.domain}
            },
            {
                "type": "solution",
                "content": json.dumps(session.guidance),
                "metadata": {"sessionId": session.session_id, "domain": session.domain}
            },
            {
                "type": "principle",
                "content": session.reflection,
                "metadata": {"sessionId": session.session_id, "domain": session.domain}
            }
        ]
        
        # TODO: Call retrievalService.upsertSession(chunks)
        log.info(f"[{session.session_id}] Session stored for future retrieval")
    
    def get_session(self, session_id: str) -> Optional[DiagnosticSession]:
        """Get session by ID."""
        return self.sessions.get(session_id)
    
    def create_session(self, user_id: str, domain: str) -> DiagnosticSession:
        """Create a new diagnostic session."""
        session_id = f"{user_id}-{domain}-{datetime.now().timestamp()}"
        session = DiagnosticSession(session_id, user_id, domain)
        self.sessions[session_id] = session
        return session


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

_mentor_orchestrator: Optional[MentorLoopOrchestrator] = None


def get_mentor_orchestrator(
    diagnostic_service=None,
    retrieval_service=None,
    model_service=None
) -> MentorLoopOrchestrator:
    """Get or create the mentor orchestrator."""
    global _mentor_orchestrator
    if _mentor_orchestrator is None:
        _mentor_orchestrator = MentorLoopOrchestrator(
            diagnostic_service=diagnostic_service,
            retrieval_service=retrieval_service,
            model_service=model_service
        )
    return _mentor_orchestrator


__all__ = [
    "MentorStage",
    "DiagnosticSession",
    "MentorLoopOrchestrator",
    "get_mentor_orchestrator",
]
