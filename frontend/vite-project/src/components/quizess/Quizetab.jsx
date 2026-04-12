
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { quizeservices } from '../../services/quizeservices';
import toast from 'react-hot-toast';
import { aiservices } from '../../services/aiservices';
import { Plus } from 'lucide-react';
import Button from '../common/Buttons';
import Emptystate from '../common/Emptystate';
import Spinner from '../common/Spinner';
import Quizecard from './Quizecard';
import Modal from '../common/Modal';
function Quizetab() {
    const { id: documentid } = useParams();
    const [quizes, setquizes] = useState([]);
    const [loading, setloading] = useState(true);
    const [generating, setgenerating] = useState(false);
    const [isdeletemodalopen, setisdeletemodalopen] = useState(false);
    const [isgeneratemodalopen, setisgeneratemodalopen] = useState(false);
    const [deleting, setdeleting] = useState(false);
    const [selectedquiz, setselectedquiz] = useState(null);
    const [numquestion, setnumquestion] = useState(5);
    const [title, settitle] = useState('');


    const fetchquzies = async () => {
        setloading(true);
        try {
            const response = await quizeservices.getallquizes(documentid);
            setquizes(response.data.quizes);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch quizes");
        }
        finally {
            setloading(false);
        }
    }
    useEffect(() => {
        if (documentid) {
            fetchquzies();
        }
    }, [documentid])
    const generatquzie = async (e) => {
        e.preventDefault();
        setgenerating(true);
        try {
            await aiservices.generatequiz(documentid, { numquestion, title });
            setisgeneratemodalopen(false);
            settitle('');
            setnumquestion(5);
            toast.success("Quiz generated successfully");
            fetchquzies();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate quiz");
        }
        finally {
            setgenerating(false);
        }
    }
    const handledeleterequest = async (quiz) => {
        setselectedquiz(quiz);
        setisdeletemodalopen(true);
    }
    const handleconfirmdelete = async () => {
        setdeleting(true);
        try {
            await quizeservices.deletequize(selectedquiz._id);
            setisdeletemodalopen(false);
            setselectedquiz(null);
            toast.success("Quiz deleted successfully");
            fetchquzies();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete quiz");
        }
        finally {
            setdeleting(false);
        }
    }
    const renderquizecontent = () => {
        if (loading) {
            return <Spinner />;
        }
        // Render quiz content here
        if (quizes.length === 0) {
            return (
                <Emptystate title="No Quizes found" description="Generate quizes from your document content" />
            )
        }
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {quizes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="transition-all duration-200 hover:-translate-y-1"
                    >
                        <Quizecard
                            quiz={quiz}
                            onDelete={handledeleterequest}
                        />
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Quiz Generator
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Create and manage quizzes from your document content
                    </p>
                </div>

                <Button
                    onClick={() => setisgeneratemodalopen(true)}
                    className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition-transform duration-200 group-hover:rotate-90">
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                    </div>

                    <div className="text-left">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-100">
                            Start Here
                        </p>
                        <p className="text-sm font-semibold text-white">
                            Generate Quiz
                        </p>
                    </div>
                </Button>
            </div>

            {renderquizecontent()}
            {/* Generate Quiz */}
            <Modal
                isOpen={isgeneratemodalopen}
                onClose={() => setisgeneratemodalopen(false)}
                title="Generate New Quiz"
            >
                <form
                    onSubmit={generatquzie}
                    className="space-y-6"
                >
                    {/* Quiz Title */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Quiz Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            required
                            placeholder="e.g. React Fundamentals Quiz"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Number of Questions */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Number of Questions
                        </label>

                        <input
                            type="number"
                            value={numquestion}
                            onChange={(e) =>
                                setnumquestion(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            min="1"
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setisgeneratemodalopen(false)}
                            disabled={generating}
                            className="rounded-2xl px-5"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={generating}
                            className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600"
                        >
                            {generating ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Generating...
                                </span>
                            ) : (
                                "Generate Quiz"
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
            {/* Delete Confirmation */}
            <Modal
                isOpen={isdeletemodalopen}
                onClose={() => setisdeletemodalopen(false)}
                title="Confirm Delete Quiz"
            >
                <div className="space-y-6">
                    <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
                        <p className="text-sm leading-7 text-slate-700">
                            Are you sure you want to delete the quiz{" "}
                            <span className="font-semibold text-slate-900">
                                "{selectedquiz?.title}"
                            </span>
                            ? This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setisdeletemodalopen(false)}
                            disabled={deleting}
                            className="rounded-2xl px-5"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleconfirmdelete}
                            disabled={deleting}
                            className="rounded-2xl bg-linear-to-r from-rose-500 to-red-500 px-6 text-white shadow-lg shadow-rose-500/20 hover:from-rose-600 hover:to-red-600"
                        >
                            {deleting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete Quiz"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Quizetab