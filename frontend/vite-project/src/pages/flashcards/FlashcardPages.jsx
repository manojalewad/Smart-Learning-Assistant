import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { flashcardservices } from '../../services/flashcardservices';
import Flashcard from '../../components/flashcards/Flashcard';
import Spinner from '../../components/common/Spinner';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Trash2
} from 'lucide-react';

function FlashcardPages() {
    const { id: documentid } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [flashcardsset, setFlashcardsset] = useState([]);
    const [selectedset, setSelectedset] = useState(null);
    const [cardindex, setCardindex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [setToDelete, setSetToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchflashcardsets = async () => {
        try {
            setLoading(true);

            const response = await flashcardservices.getflashcardsetbyid(documentid);

            // API may return either object or array
            const data = response?.data;

            if (!data) {
                setFlashcardsset([]);
                setSelectedset(null);
                return;
            }

            const flashcardSet = Array.isArray(data) ? data[0] : data;

            if (!flashcardSet || !flashcardSet.cards) {
                setFlashcardsset([]);
                setSelectedset(null);
                return;
            }

            setFlashcardsset([flashcardSet]);
            setSelectedset(flashcardSet);
            setCardindex(0);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch flashcards');
            setFlashcardsset([]);
            setSelectedset(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentid) {
            fetchflashcardsets();
        }
    }, [documentid]);

    const handlereview = async () => {
        const currcard = selectedset?.cards?.[cardindex];

        if (!currcard) return;

        try {
            await flashcardservices.reviewflashcards(currcard._id);
        } catch (error) {
            console.error(error);
        }
    };

    const handlenextcard = async () => {
        if (!selectedset?.cards?.length) return;

        await handlereview();
        setIsFlipped(false);

        setCardindex((prev) => {
            return (prev + 1) % selectedset.cards.length;
        });
    };

    const handleprevcard = async () => {
        if (!selectedset?.cards?.length) return;

        await handlereview();
        setIsFlipped(false);

        setCardindex((prev) => {
            return (
                (prev - 1 + selectedset.cards.length) %
                selectedset.cards.length
            );
        });
    };

    const handeltogglecard = async (cardid) => {
        try {
            await flashcardservices.toggleflashcard(cardid);

            const updatedSets = flashcardsset.map((set) => {
                if (set._id !== selectedset._id) return set;

                return {
                    ...set,
                    cards: set.cards.map((card) => {
                        if (card._id === cardid) {
                            return {
                                ...card,
                                isstarred: !card.isstarred
                            };
                        }
                        return card;
                    })
                };
            });

            setFlashcardsset(updatedSets);

            const updatedSelectedSet = updatedSets.find(
                (set) => set._id === selectedset._id
            );

            if (updatedSelectedSet) {
                setSelectedset(updatedSelectedSet);
            }

            toast.success('Flashcard toggled successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to toggle flashcard');
        }
    };

    const handleDeleteRequest = (e, set) => {
        e.stopPropagation();
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!setToDelete?._id) return;

        try {
            setDeleting(true);

            await flashcardservices.deleteflashcardset(setToDelete._id);

            toast.success('Flashcard set deleted successfully');

            setIsDeleteModalOpen(false);
            setSetToDelete(null);

            // navigate after delete
            navigate('/flashcards');
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                    'Failed to delete flashcard set'
            );
        } finally {
            setDeleting(false);
        }
    };

    const renderDeleteModal = () => {
        if (!isDeleteModalOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                    <h2 className="text-xl font-bold text-slate-900">
                        Delete Flashcard Set
                    </h2>

                    <p className="mt-3 text-sm text-slate-600">
                        Are you sure you want to delete this flashcard set? This
                        action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setSetToDelete(null);
                            }}
                            disabled={deleting}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderflashcardviewer = () => {
        if (
            !selectedset ||
            !selectedset.cards ||
            selectedset.cards.length === 0
        ) {
            return (
                <div className="flex min-h-75 items-center justify-center rounded-3xl border border-slate-200 bg-white">
                    <p className="text-slate-500">No flashcards found</p>
                </div>
            );
        }
        
        const currentCard = selectedset.cards[cardindex];

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate('/flashcards')}
                        className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                        <ArrowLeft
                            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                            strokeWidth={2}
                        />
                        Back
                    </button>

                    <button
                        onClick={(e) =>
                            handleDeleteRequest(e, selectedset)
                        }
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                        Delete Set
                    </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mx-auto max-w-4xl">
                        <Flashcard
                            flashcard={currentCard}
                            onToggleStar={handeltogglecard}
                            isFlipped={isFlipped}
                            setIsFlipped={setIsFlipped}
                        />
                    </div>
                </div>

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
    };

    if (loading) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                {renderflashcardviewer()}
            </div>

            {renderDeleteModal()}
        </>
    );
}

export default FlashcardPages;