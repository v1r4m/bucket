import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = [
  { name: "🔥지옥", min: -Infinity, max: -3000, face: "😵" },
  { name: "🕳️지하", min: -2999, max: -1000, face: "😟" },
  { name: "🌍지상", min: -999, max: 2999, face: "😊" },
  { name: "☁️구름", min: 3000, max: 4999, face: "😄" },
  { name: "🌌우주", min: 5000, max: Infinity, face: "🤩" },
];

export default function CalorieStairGame() {
  const [calories, setCalories] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("calories");
    if (saved !== null) {
      setCalories(Number(saved));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("calories", calories);
    }
  }, [calories, isInitialized]);

  const getLevel = () => {
    return LEVELS.find((level) => calories >= level.min && calories <= level.max);
  };

  const handleConfirm = () => {
    const value = Number(inputValue);
    if (modalType === "burn") {
      setCalories((prev) => prev + value);
      if (value >= 1000) {
        setMessage("💪 우와! 많이 올랐어요!");
      }
    } else if (modalType === "eat") {
      setCalories((prev) => prev - value);
      if (value >= 1000) {
        setMessage("😱 꽉 잡아! 많이 떨어졌어!");
      }
    }
    setInputValue(0);
    setModalType(null);
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const currentLevel = getLevel();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-200 to-white relative">
      <motion.div
        key={animationKey}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-4xl font-bold mb-4"
      >
        {currentLevel.name}
      </motion.div>

      <motion.div
        key={`char-${animationKey}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-6xl"
      >
        {currentLevel.face}
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="absolute top-20 text-xl bg-white px-4 py-2 rounded-full shadow"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-lg">총 소모 칼로리: {calories} kcal</div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setModalType("burn")}
          className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"
        >
          🔥 소모 칼로리
        </button>
        <button
          onClick={() => setModalType("eat")}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"
        >
          🍽️ 섭취 칼로리
        </button>
      </div>

      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "burn" ? "소모 칼로리 입력" : "섭취 칼로리 입력"}
              </h2>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg text-center"
                placeholder="칼로리"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  확인
                </button>
                <button
                  onClick={() => setModalType(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
