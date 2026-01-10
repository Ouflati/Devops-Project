import React, { useState } from 'react';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // 2 options par défaut
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() === '') {
      setError('La question est obligatoire');
    } else {
      setError('');
      // Hna fin ghadi t-calliw l-API f l-mustaqbal
      console.log("Sondage créé:", { question, options });
    }
  };

  return (
    <div className="create-poll-container">
      <h2>Créer un nouveau sondage</h2>
      
      {/* Input dial Question */}
      <input
        type="text"
        placeholder="Entrez votre question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      
      {/* Affichage dial l-message d'erreur */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Inputs dial les Options */}
      {options.map((opt, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
        />
      ))}

      {/* Boutons d'action */}
      <button onClick={handleAddOption}>Ajouter une option</button>
      <button onClick={handleSubmit}>Créer le sondage</button>
    </div>
  );
};

export default CreatePoll;