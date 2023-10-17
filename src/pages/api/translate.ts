import type { NextApiRequest, NextApiResponse } from 'next';
import * as langdetect from "langdetect";
//@ts-ignore
import translate from 'translate-google';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { text, to } = req.body;

  const detectedLang: string = langdetect.detectOne(text);
  
  try {
    const translatedText = await translate(text, { detectedLang, to });
    res.status(200).json({ translations: translatedText, detectedLang: detectedLang });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Translation failed' });
  }
};
