
import React from 'react'
import { useState, useEffect } from 'react';
import { flashcardservices } from '../../services/flashcardservices';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { aiservices } from '../../services/aiservices';
import Spinner from '../common/Spinner';
import { Brain, Sparkles, BookOpen, Trash2, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../common/Modal';
import moment from 'moment';
import Flashcard from './Flashcard';


function Flashcardtab() {
    const { id: documentid } = useParams();
    const [loading, setloading] = useState(true);
    const [flashcardsset, setflashcardsset] = useState([]);
    const [cardindex, setcardindex] = useState(0);
    const [generating, setgenerating] = useState(false);
    const [isdeletemodalopen, setisdeletemodalopen] = useState(false);
    const [selectedset, setselectedset] = useState(null);
    const [deleting, setdeleting] = useState(false);
    const [settodelete, setsettodelete] = useState(null);
    const [isFlipped, setisFlipped] = useState(false);

    const fetchflashcardsets = async () => {
        setloading(true);
        try {
            const response = await flashcardservices.getflashcards(documentid);
            setflashcardsset(response.data.flashcards);
        } catch (error) {
            toast.error('Failed to fetch flashcards');
            console.error(error);
        } finally {
            setloading(false);

        }
    }
    useEffect(() => {
        if (documentid) {
            fetchflashcardsets();
        }
    }, [documentid])
    const handlegenerateflashcards = async () => {
        setgenerating(true);
        try {
            await aiservices.generateflashcard(documentid);
            toast.success('Flashcards generated successfully');
            fetchflashcardsets();
        } catch (error) {
            toast.error('Failed to generate flashcards');
            console.error(error);
        } finally {
            setgenerating(false);
        }
    }
    const handlenextcard = async () => {
        if (selectedset) {
            handlereview(selectedset);
            setisFlipped(false);
            setcardindex(prev => (prev + 1) % selectedset.cards.length)
        }
    }
    const handleprevcard = async () => {
        if (selectedset) {
            setisFlipped(false);
            handlereview(selectedset);
            setcardindex(prev => (prev - 1 + selectedset.cards.length) % selectedset.cards.length)
        }
    }

    const handlereview = async (index) => {
        const currcard = selectedset?.cards[cardindex];
        if (!currcard) {
            return;
        }
        try {
            await flashcardservices.reviewflashcards(currcard._id, index);
            toast.success('Flashcard reviewed successfully');
        } catch (error) {
            console.error('Failed to review flashcard');
            toast.error('Failed to review flashcard');
        }
    }

    const handeltogglecard = async (cardid) => {
        try {
            await flashcardservices.toggleflashcard(cardid);

            const updateset = flashcardsset.map((set) => {
                if (set._id === selectedset._id) {
                    const updatecards = set.cards.map((card) => {
                        return card._id === cardid
                            ? { ...card, isstarred: !card.isstarred }
                            : card;
                    });

                    return { ...set, cards: updatecards };
                }

                return set;
            });

            setflashcardsset(updateset);
            setselectedset(updateset.find((set) => set._id === selectedset._id));

            toast.success("Flashcard toggled successfully");
        } catch (error) {
            console.error("Failed to toggle flashcard", error);
            toast.error("Failed to toggle flashcard");
        }
    };
    const handledeleterequest = (e, sets) => {
        e.stopPropagation();
        setisdeletemodalopen(true);
        setsettodelete(sets);
    }
    const handleselectset = (sets) => {
        setselectedset(sets);
        setcardindex(0);
    }
    const renderflashcardviewer = () => {
        const currentCard = selectedset.cards[cardindex];
        return (
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => setselectedset(null)}
                    className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                >
                    <ArrowLeft
                        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                        strokeWidth={2}
                    />
                    Back to Sets
                </button>

                {/* Flashcard Display */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mx-auto max-w-4xl">
                        <Flashcard
                            flashcard={currentCard}
                            onToggleStar={handeltogglecard}
                            isFlipped={isFlipped}
                            setIsFlipped={setisFlipped}
                        />
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={handleprevcard}
                        disabled={selectedset.cards.length <= 1}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft
                            className="h-5 w-5"
                            strokeWidth={2.5}
                        />
                        Previous
                    </button>

                    <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-50 px-5 py-3">
                        <span className="text-lg font-bold text-slate-900">
                            {cardindex + 1}
                        </span>

                        <span className="text-slate-400">/</span>

                        <span className="text-sm font-medium text-slate-500">
                            {selectedset.cards.length}
                        </span>
                    </div>

                    <button
                        onClick={handlenextcard}
                        disabled={selectedset.cards.length <= 1}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                        <ChevronRight
                            className="h-5 w-5"
                            strokeWidth={2.5}
                        />
                    </button>
                </div>
            </div>
        );
    }
    const handleconfirmdelete = async () => {
        if (!settodelete) {
            return;
        }
        setdeleting(true);
        try {
            await flashcardservices.deleteflashcardset(settodelete._id);
            toast.success('Flashcard set deleted successfully');
            setisdeletemodalopen(false);
            setsettodelete(null);
            fetchflashcardsets();
        } catch (error) {
            toast.error('Failed to delete flashcard set');
            console.error(error);
        }
        finally {
            setdeleting(false);
        }
    }
    const rendersetlist = () => {
        if (loading) {
            return (
                <div className='flex items-center justify-center h-48'>
                    <Spinner />
                </div>
            )
        }
        if (flashcardsset.length === 0) {
            return (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mx-auto max-w-lg text-center">
                        {/* Icon */}
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                            <Brain className="h-10 w-10" strokeWidth={2} />
                        </div>

                        {/* Heading */}
                        <h3 className="text-2xl font-bold text-slate-900">
                            No Flashcards Yet
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm leading-7 text-slate-500">
                            Generate flashcards from your document to start learning and reinforce
                            your knowledge.
                        </p>

                        {/* Button */}
                        <button
                            onClick={handlegenerateflashcards}
                            disabled={generating}
                            className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {generating ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles
                                        className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                                        strokeWidth={2}
                                    />
                                    Generate Flashcards
                                </>
                            )}
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            Your Flashcard Sets
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {flashcardsset.length}{" "}
                            {flashcardsset.length === 1 ? "set" : "sets"} available
                        </p>
                    </div>

                    <button
                        onClick={handlegenerateflashcards}
                        disabled={generating}
                        className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-violet-500 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {generating ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Plus
                                    className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90"
                                    strokeWidth={2.5}
                                />
                                Generate New Set
                            </>
                        )}
                    </button>
                </div>

                {/* Flashcard Sets Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {flashcardsset.map((set) => (
                        <div
                            key={set._id}
                            onClick={() => handleselectset(set)}
                            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handledeleterequest(e, set)}
                                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 opacity-0 transition-all duration-200 hover:bg-red-100 group-hover:opacity-100"
                            >
                                <Trash2 className="h-5 w-5" strokeWidth={2} />
                            </button>

                            {/* Top Icon */}
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                                <Brain className="h-7 w-7" strokeWidth={2} />
                            </div>

                            {/* Title + Date */}
                            <div>
                                <h4 className="line-clamp-1 text-lg font-bold text-slate-900">
                                    Flashcard Set
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                    Created {moment(set.createdat).format("MMM D, YYYY")}
                                </p>
                            </div>

                            {/* Cards Count */}
                            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                        <BookOpen className="h-5 w-5" strokeWidth={2} />
                                    </div>

                                    <div>
                                        <p className="text-lg font-bold text-slate-900">
                                            {set.cards.length}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500">
                                            {set.cards.length === 1 ? "card" : "cards"}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                                    View
                                </div>
                            </div>

                            {/* Hover Border Glow */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 group-hover:border-violet-200/70" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div >
                {selectedset ? renderflashcardviewer() : rendersetlist()}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isdeletemodalopen}
                onClose={() => setisdeletemodalopen(false)}
                title="Delete Flashcard Set?"
            >
                <div className="space-y-6">
                    {/* Warning Box */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                        <p className="text-sm leading-7 text-slate-700">
                            Are you sure you want to delete this flashcard set? This action
                            cannot be undone and all cards will be permanently removed.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={() => setisdeletemodalopen(false)}
                            disabled={deleting}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleconfirmdelete}
                            disabled={deleting}
                            className="h-11 rounded-2xl bg-linear-to-r from-rose-500 to-red-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-rose-600 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deleting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete Set"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Flashcardtab