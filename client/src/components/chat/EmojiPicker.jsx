import React from 'react';
import { motion } from 'framer-motion';

const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
    '👍', '👎', '👌', '✋', '🤚', '🖐', '✌️', '🤞', '🤟', '🤘',
    '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐',
    '🔥', '💯', '💢', '💥', '💫', '💦', '💨', '🕳', '💣', '💬',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔'
  ];

  const categories = {
    'Smileys': emojis.slice(0, 30),
    'Gestures': emojis.slice(30, 50),
    'Symbols': emojis.slice(50, 60),
    'Hearts': emojis.slice(60, 70)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#131313] rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 p-4 w-80 max-h-96 overflow-y-auto"
    >
      {Object.entries(categories).map(([category, categoryEmojis]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {category}
          </h3>
          <div className="grid grid-cols-8 gap-2">
            {categoryEmojis.map((emoji, index) => (
              <button
                key={`${category}-${index}`}
                onClick={() => onEmojiSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default EmojiPicker;
