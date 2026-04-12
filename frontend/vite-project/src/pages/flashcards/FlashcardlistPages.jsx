import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { flashcardservices } from '../../services/flashcardservices';
import Spinner from '../../components/common/Spinner';
import Emptystate from '../../components/common/Emptystate';
import PageHeader from '../../components/common/PageHeader';
import Flashcardsetcard from './Flashcardsetcard';
function FlashcardlistPages() {
  const [flashcardset, setflashcardset] = useState([]);
  const [loading, setloading] = useState(true);
  const fetchflashcardset = async () => {
    setloading(true);
    try {
      const response = await flashcardservices.getallflashcards();
      setflashcardset(response.data.flashcards);
    } catch (error) {
      toast.error('Failed to fetch flashcard sets');
      console.error(error);
    } finally {
      setloading(false);
    }
  }
  useEffect(() => {
    fetchflashcardset();
  }, [])
  const rendercontent = () => {
    if (loading) {
      return (
        <Spinner />
      )
    }
    if (flashcardset.length === 0) {
      return (
        <Emptystate
          title="No flashcards found"
          description="You haven't created any flashcards yet. Start creating flashcards to enhance your learning experience!"
        />
      )
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashcardset.map((set) => (
          <Flashcardsetcard
            key={set._id}
            flashcardset={set}
          />
        ))}
      </div>
    );
  };
  return (
    <div>
      <PageHeader title="Your Flashcard Sets" />
      {rendercontent()}
    </div>
  )

}

export default FlashcardlistPages