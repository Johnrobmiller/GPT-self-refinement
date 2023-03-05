import { useState } from 'react';

import Seo from '@/components/Seo';

export default function HomePage() {
  const [responseFromGpt, setResponseFromGpt] = useState<string>();
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    fetch('/api/primaryCompletionsEndpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput,
      }),
    })
      .then((res) => res.json())
      .then((gptResponse: string) => {
        setUserInput('');
        setResponseFromGpt(gptResponse);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setSubmitError(JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <>
      <Seo />
      <div
        id='main-content-container'
        className='mt-14 flex flex-col items-center justify-center space-y-14'
      >
        <h1 id='main-header'>GPT-Self-Refinement Demo</h1>
        <p id='description' className='w-[500px] max-w-[75%] text-center'>
          This is a demo of the GPT-Self-Refinement self-refinement strategy.
          Although this repo is public, it was only born very recently and
          nothing has been built yet. So, please Do not expect anything to work
          (for now). When things start working, I will remove this text and
          replace it with something more marketing-friendly.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor='user-input' className='mr-4'>
            User Input:
          </label>
          <input
            id='user-input'
            value={userInput}
            onChange={(e) => setUserInput(e.currentTarget.value)}
            className='rounded-md border border-white bg-black'
          />
          {submitError && (
            <p className='text-red-400' id='submit-error'>
              {submitError}
            </p>
          )}
          <button
            id='submit-button'
            type='submit'
            disabled={loading}
            className='mx-auto mt-4 block rounded-xl bg-slate-500 px-4 py-3 text-xl'
          >
            {loading ? '...' : 'Submit'}
          </button>
        </form>
        <div>
          <label
            id='response-from-gpt-label'
            className='mx-auto block text-center text-2xl'
          >
            Response from GPT
          </label>
          <p
            id='response-from-gpt'
            className='mx-auto mt-4 w-[500px] max-w-[75%] text-center'
          >
            {responseFromGpt}
          </p>
        </div>
      </div>
    </>
  );
}
