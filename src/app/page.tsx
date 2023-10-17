"use client";

import { useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

const languages: string[] = ["uk", "ru", "en", "pl"];

const Home = () => {
  const [text, setText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const [translations, setTranslations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const translationPromises = languages.map((lang) =>
        axios.post("/api/translate", {
          text,
          to: lang,
        })
      );

      const translatedTexts = await Promise.all(translationPromises);
      setTranslations(
        translatedTexts.map((response) => response.data.translations)
      );
      setDetectedLanguage(translatedTexts[0].data.detectedLang);

      setIsLoading(false);
    } catch (error) {
      console.error("Translation error:", error);
      setIsLoading(false);
    }
  };
  return (
    <div className="grid h-[100vh] place-content-center">
      <textarea
        rows={4}
        className="block w-[500px] mb-5 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        className="text-white w-[500px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleTranslate}
      >
        Translate
      </button>
      {/* <p>Detected Language: {detectedLanguage}</p> */}
      {!isLoading ? (
        <ul className="w-[500px]">
          {translations.map((translation, index) => (
            <li className="mb-2" key={languages[index]}>
              <span
                className={
                  languages[index] === detectedLanguage ? "text-orange-400" : ""
                }
              >
                {languages[index] === detectedLanguage
                  ? languages[index] + " " + "original"
                  : languages[index]}
              </span>
              : {translation}
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid place-content-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default Home;
