'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setSelectedModel } from '../redux/slices/modelSlice';
import { TextSummarizationModels } from '../types/common';
import axios from 'axios';
import Cookies from 'js-cookie';

const TextSummarization: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedModel = useSelector((state: RootState) => state.model.selectedModel);
  const [userInput, setUserInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [translationLoading, setTranslationLoading] = useState<boolean>(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const models: TextSummarizationModels[] = [
    { name: 'Titan - Lite', id: 'amazon.titan-text-lite-v1' },
    { name: 'Titan - Express', id: 'amazon.titan-text-express-v1' },
    { name: 'Cohere - Command', id: 'cohere.command-text-v14' },
    { name: 'Jurassic-2 - Ultra', id: 'ai21.j2-ultra-v1' },
  ];

  const languages = [
    'French', 'Spanish', 'Italian', 'German', 'Brazilian Portuguese',
    'Japanese', 'Korean', 'Simplified Chinese', 'Arabic'
  ];

  const modelEndpoints: { [key: string]: string } = {
    'cohere.command-text-v14': 'http://127.0.0.1:8000/api/cohere-command-text-summary/',
    'ai21.j2-ultra-v1': 'http://127.0.0.1:8000/api/jurassic-ultra-text-summary/',
    'amazon.titan-text-express-v1': 'http://127.0.0.1:8000/api/titan-express-text-summary/',
    'amazon.titan-text-lite-v1': 'http://127.0.0.1:8000/api/titan-lite-text-summary/',
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedModel(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const language = event.target.value;
    setSelectedLanguages(prev =>
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    );
  };

  const handleSubmit = async () => {
    const appendedText = `${userInput}\n###\nSummarize the above conversation.`;
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const endpoint = modelEndpoints[selectedModel];
      if (!endpoint) {
        setError('Invalid model selected.');
        return;
      }
      const response = await axios.post(endpoint, { prompt: appendedText });
      setResult(response.data.generated_text);
    } catch (error) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!result) {
      setError('No summary available to translate.');
      return;
    }
    const languagesString = selectedLanguages.join(', ');
    const translationPrompt = `Interpret the text below into ${languagesString}:\n${result}`;
  
    setTranslationResult(null);
    setError(null);
    setTranslationLoading(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/command-r-text-summary/', {
        prompt: translationPrompt
      });
      setTranslationResult(response.data.generated_text);
    } catch (error) {
      setError('Failed to generate translation. Please try again.');
    } finally {
      setTranslationLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    const userId = Cookies.get('user_id'); // Get user_id from cookies
    if (!userId) {
      setError('User not authenticated.');
      return;
    }
    if (!translationResult) {
      setError('No translation result available to save.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/text-summarization-history/', {
        user_id: userId,
        summary: translationResult
      });
      alert('Summary saved successfully.');
    } catch (error) {
      setError('Failed to save summary. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-start p-6 rounded-lg lg:w-4/5">
      <h2 className="text-xl font-bold mb-4">Text Summarization</h2>
      <label htmlFor="model-dropdown" className="mb-2 text-lg font-medium text-gray-700">
        Select a Model:
      </label>
      <select
        id="model-dropdown"
        value={selectedModel}
        onChange={handleChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">--Please choose an option--</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter text here"
        className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      ></textarea>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
      {loading && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md flex items-center space-x-2">
          <div className="w-5 h-5 border-4 border-t-blue-500 border-gray-200 border-solid rounded-full animate-spin"></div>
          <p>Summary is loading...</p>
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold">Generated Summary:</h3>
          <p>{result}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 border border-red-500 text-red-500 rounded-md">
          <p>{error}</p>
        </div>
      )}
      <div className="mt-4">
        <label className="block mb-2 text-lg font-medium text-gray-700">Select Languages for Translation:</label>
        {languages.map((language) => (
          <div key={language} className="mb-2">
            <input
              type="checkbox"
              id={language}
              value={language}
              checked={selectedLanguages.includes(language)}
              onChange={handleLanguageChange}
              className="mr-2"
            />
            <label htmlFor={language} className="text-gray-700">{language}</label>
          </div>
        ))}
        <button
          onClick={handleTranslate}
          className="px-4 py-2 text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Translate
        </button>
        {translationLoading && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md flex items-center space-x-2">
            <div className="w-5 h-5 border-4 border-t-green-500 border-gray-200 border-solid rounded-full animate-spin"></div>
            <p>Translation is loading...</p>
          </div>
        )}
        {translationResult && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">Generated Translation:</h3>
            <p>{translationResult}</p>
          </div>
        )}
      </div>
      {translationResult && (
        <div className="mt-4">
          <button
            onClick={handleSaveSummary}
            className="px-4 py-2 text-white bg-purple-500 rounded-md shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Save Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default TextSummarization;

