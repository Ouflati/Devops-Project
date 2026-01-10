import { render, screen, fireEvent } from '@testing-library/react';
import CreatePoll from '../CreatePoll';
import '@testing-library/jest-dom';

describe('TDD: Composant CreatePoll', () => {
  test('devrait afficher les champs du formulaire', () => {
    render(<CreatePoll />);
    expect(screen.getByPlaceholderText(/Entrez votre question/i)).toBeInTheDocument();
    expect(screen.getByText(/Ajouter une option/i)).toBeInTheDocument();
  });

  test('devrait afficher une erreur si la question est vide', () => {
    render(<CreatePoll />);
    const btn = screen.getByText(/Créer le sondage/i);
    fireEvent.click(btn);
    expect(screen.getByText(/La question est obligatoire/i)).toBeInTheDocument();
  });
});