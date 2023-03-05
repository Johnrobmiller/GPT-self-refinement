import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

import { PrimaryCompletionsRes } from '@/lib/types';

export default async function getPrimaryCompletionsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as PrimaryCompletionsRes;

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const setupPrompt = 'Testing, testing, 123';

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        { role: 'system', content: setupPrompt },
        { role: 'user', content: body.userInput },
      ],
    });

    const responseFromGpt = completion.data.choices[0]?.message?.content;

    if (!responseFromGpt) {
      const errMessage = 'Error: the response from GPT is empty.';
      console.error(errMessage);
      return res.status(500).json({ error: errMessage });
    }

    return res.status(200).json(responseFromGpt);
  } catch (error) {
    const errMessage =
      'Error: There was an error when calling the OpenAI API. Check the server logs for more details. Here is the error from the catch block: ';
    console.error(errMessage, error);
    return res.status(500).json({ error: errMessage + JSON.stringify(error) });
  }
}
