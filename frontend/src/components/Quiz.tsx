import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type QuestionType = 'multiple-choice' | 'true-false' | 'matching';

interface BaseQuestion {
    id: number;
    type: QuestionType;
    question: string;
    topic: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    options: string[];
    correctAnswer: number;
}

interface TrueFalseQuestion extends BaseQuestion {
    type: 'true-false';
    correctAnswer: boolean;
}

interface MatchingQuestion extends BaseQuestion {
    type: 'matching';
    leftItems: string[];
    rightItems: string[];
    correctMatches: Record<number, number>;
}

type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion | MatchingQuestion;

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        type: 'multiple-choice',
        question: "What should you do when you log into your school account?",
        options: [
            "Share your password with friends",
            "Use your own username and password",
            "Use someone else's account",
            "Write your password on paper"
        ],
        correctAnswer: 1,
        topic: "Logging into accounts"
    },
    {
        id: 2,
        type: 'true-false',
        question: "You should use the same password for all your accounts.",
        correctAnswer: false,
        topic: "Using passwords safely"
    },
    {
        id: 3,
        type: 'multiple-choice',
        question: "What makes a strong password?",
        options: [
            "Your name and birthday",
            "Letters, numbers, and symbols mixed together",
            "A simple word like 'password'",
            "Your pet's name"
        ],
        correctAnswer: 1,
        topic: "Using passwords safely"
    },
    {
        id: 4,
        type: 'true-false',
        question: "It is okay to eat and drink near school computers.",
        correctAnswer: false,
        topic: "Using school devices properly"
    },
    {
        id: 5,
        type: 'matching',
        question: "Match each action with the correct file management practice:",
        leftItems: [
            "Save your work",
            "Name your file",
            "Find your file",
            "Delete old files"
        ],
        rightItems: [
            "Use clear names like 'Math_Homework_Jan29'",
            "Click Save often while working",
            "Check the correct folder location",
            "Remove files you don't need anymore"
        ],
        correctMatches: {
            0: 1,
            1: 0,
            2: 2,
            3: 3
        },
        topic: "Saving and naming files"
    },
    {
        id: 6,
        type: 'multiple-choice',
        question: "What should you do before you log out of a school computer?",
        options: [
            "Leave all programs open",
            "Save your work and close programs",
            "Turn off the computer quickly",
            "Delete all your files"
        ],
        correctAnswer: 1,
        topic: "Using school devices properly"
    },
    {
        id: 7,
        type: 'true-false',
        question: "You should tell your teacher if you forget your password.",
        correctAnswer: true,
        topic: "Logging into accounts"
    },
    {
        id: 8,
        type: 'multiple-choice',
        question: "Where is the best place to save your school work?",
        options: [
            "On the desktop only",
            "In a folder with a clear name",
            "Anywhere on the computer",
            "Don't save it"
        ],
        correctAnswer: 1,
        topic: "Saving and naming files"
    },
    {
        id: 9,
        type: 'matching',
        question: "Match each device rule with its reason:",
        leftItems: [
            "Clean hands",
            "Careful with cables",
            "Report problems",
            "No games during class"
        ],
        rightItems: [
            "Keeps the keyboard and screen clean",
            "Prevents damage to equipment",
            "Helps fix issues quickly",
            "Helps you focus on learning"
        ],
        correctMatches: {
            0: 0,
            1: 1,
            2: 2,
            3: 3
        },
        topic: "Using school devices properly"
    },
    {
        id: 10,
        type: 'multiple-choice',
        question: "What is a good file name for your English essay?",
        options: [
            "essay",
            "English_Essay_MyName_Jan2026",
            "file1",
            "homework"
        ],
        correctAnswer: 1,
        topic: "Saving and naming files"
    }
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
    const [showResults, setShowResults] = useState(false);

    const handleMultipleChoiceSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleTrueFalseSelect = (questionId: number, answer: boolean) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleMatchingSelect = (questionId: number, leftIndex: number, rightIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...(prev[questionId] || {}),
                [leftIndex]: rightIndex
            }
        }));
    };

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
    };

    const isQuestionAnswered = (question: QuizQuestion): boolean => {
        const answer = selectedAnswers[question.id];
        if (question.type === 'matching') {
            const matches = answer || {};
            return question.leftItems.every((_, idx) => matches[idx] !== undefined);
        }
        return answer !== undefined;
    };

    const isQuestionCorrect = (question: QuizQuestion): boolean => {
        const answer = selectedAnswers[question.id];
        if (question.type === 'multiple-choice') {
            return answer === question.correctAnswer;
        } else if (question.type === 'true-false') {
            return answer === question.correctAnswer;
        } else if (question.type === 'matching') {
            const matches = answer || {};
            return Object.keys(question.correctMatches).every(
                key => matches[parseInt(key)] === question.correctMatches[parseInt(key)]
            );
        }
        return false;
    };

    const calculateScore = () => {
        let correct = 0;
        quizQuestions.forEach(q => {
            if (isQuestionCorrect(q)) {
                correct++;
            }
        });
        return correct;
    };

    const getCorrectAnswerText = (question: QuizQuestion): string => {
        if (question.type === 'multiple-choice') {
            return question.options[question.correctAnswer];
        } else if (question.type === 'true-false') {
            return question.correctAnswer ? 'True' : 'False';
        } else if (question.type === 'matching') {
            return question.leftItems.map((left, idx) => 
                `${left} → ${question.rightItems[question.correctMatches[idx]]}`
            ).join('; ');
        }
        return '';
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    const currentQ = quizQuestions[currentQuestion];
    const isAnswered = isQuestionAnswered(currentQ);
    const allQuestionsAnswered = quizQuestions.every(q => isQuestionAnswered(q));

    if (showResults) {
        const score = calculateScore();
        const percentage = (score / quizQuestions.length) * 100;

        return (
            <div className="container mx-auto max-w-4xl px-4">
                <Card className="border-2 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                        <CardDescription className="text-lg">
                            Great work! You've learned about ICT basics!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <p className="text-5xl font-bold text-primary">{score}/{quizQuestions.length}</p>
                            <p className="mt-2 text-xl text-muted-foreground">
                                You got {percentage.toFixed(0)}% correct!
                            </p>
                        </div>

                        <Alert className="border-primary/50 bg-primary/5">
                            <AlertTitle className="text-lg font-semibold">Remember:</AlertTitle>
                            <AlertDescription className="text-base">
                                Keep practicing these ICT skills. They will help you use technology safely and well at school!
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <Separator />
                            <h3 className="text-xl font-semibold">Answer Key</h3>
                            <div className="space-y-3">
                                {quizQuestions.map((q, index) => (
                                    <div key={q.id} className="rounded-lg border bg-card p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className="font-medium">{q.question}</p>
                                                <div className="flex items-start gap-2">
                                                    {isQuestionCorrect(q) ? (
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                                    ) : (
                                                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                                                    )}
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-green-600">Correct answer: </span>
                                                        {getCorrectAnswerText(q)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleRestart} className="w-full" size="lg">
                            <RotateCcw className="mr-2 h-5 w-5" />
                            Restart Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{progress.toFixed(0)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="border-2 shadow-lg">
                <CardHeader>
                    <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {currentQ.topic}
                    </div>
                    <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentQ.type === 'multiple-choice' && (
                        <RadioGroup
                            value={selectedAnswers[currentQ.id]?.toString()}
                            onValueChange={(value) => handleMultipleChoiceSelect(currentQ.id, parseInt(value))}
                        >
                            <div className="space-y-3">
                                {currentQ.options.map((option, index) => {
                                    const isSelected = selectedAnswers[currentQ.id] === index;

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <RadioGroupItem value={index.toString()} id={`q${currentQ.id}-${index}`} />
                                            <Label
                                                htmlFor={`q${currentQ.id}-${index}`}
                                                className="flex-1 cursor-pointer text-base"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </RadioGroup>
                    )}

                    {currentQ.type === 'true-false' && (
                        <div className="space-y-3">
                            <Button
                                variant={selectedAnswers[currentQ.id] === true ? 'default' : 'outline'}
                                className="w-full justify-start text-base h-auto py-4"
                                onClick={() => handleTrueFalseSelect(currentQ.id, true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                        selectedAnswers[currentQ.id] === true 
                                            ? 'border-primary-foreground bg-primary-foreground' 
                                            : 'border-current'
                                    }`}>
                                        {selectedAnswers[currentQ.id] === true && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <span>True</span>
                                </div>
                            </Button>
                            <Button
                                variant={selectedAnswers[currentQ.id] === false ? 'default' : 'outline'}
                                className="w-full justify-start text-base h-auto py-4"
                                onClick={() => handleTrueFalseSelect(currentQ.id, false)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                        selectedAnswers[currentQ.id] === false 
                                            ? 'border-primary-foreground bg-primary-foreground' 
                                            : 'border-current'
                                    }`}>
                                        {selectedAnswers[currentQ.id] === false && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <span>False</span>
                                </div>
                            </Button>
                        </div>
                    )}

                    {currentQ.type === 'matching' && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Match each item on the left with the correct item on the right:</p>
                            {currentQ.leftItems.map((leftItem, leftIndex) => (
                                <div key={leftIndex} className="space-y-2">
                                    <Label className="text-base font-medium">{leftItem}</Label>
                                    <Select
                                        value={selectedAnswers[currentQ.id]?.[leftIndex]?.toString()}
                                        onValueChange={(value) => handleMatchingSelect(currentQ.id, leftIndex, parseInt(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a match..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currentQ.rightItems.map((rightItem, rightIndex) => (
                                                <SelectItem key={rightIndex} value={rightIndex.toString()}>
                                                    {rightItem}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handlePrevious}
                            variant="outline"
                            disabled={currentQuestion === 0}
                            className="flex-1"
                        >
                            Previous
                        </Button>
                        {currentQuestion === quizQuestions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={!allQuestionsAnswered}
                                className="flex-1"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className="flex-1"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex items-center gap-3 p-4">
                        <img 
                            src="/assets/generated/school-device.dim_400x400.png" 
                            alt="School device" 
                            className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div>
                            <p className="text-sm font-semibold">Use Devices Well</p>
                            <p className="text-xs text-muted-foreground">Take care of school technology</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex items-center gap-3 p-4">
                        <img 
                            src="/assets/generated/password-security-transparent.dim_200x200.png" 
                            alt="Password security" 
                            className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div>
                            <p className="text-sm font-semibold">Stay Safe</p>
                            <p className="text-xs text-muted-foreground">Keep your passwords secure</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
