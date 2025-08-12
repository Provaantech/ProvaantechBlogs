/**
 * Emoji List with names, keywords, and categories
 * Based on the original Lexical playground emoji data
 */

const emojiList = [
  // Smileys & People
  { emoji: '😀', description: 'grinning face', aliases: ['grinning'], tags: ['smile', 'happy'] },
  { emoji: '😃', description: 'grinning face with big eyes', aliases: ['smiley'], tags: ['happy', 'joy'] },
  { emoji: '😄', description: 'grinning face with smiling eyes', aliases: ['smile'], tags: ['happy', 'joy'] },
  { emoji: '😁', description: 'beaming face with smiling eyes', aliases: ['grin'], tags: ['happy', 'smile'] },
  { emoji: '😆', description: 'grinning squinting face', aliases: ['laughing', 'satisfied'], tags: ['happy', 'haha'] },
  { emoji: '😅', description: 'grinning face with sweat', aliases: ['sweat_smile'], tags: ['hot'] },
  { emoji: '🤣', description: 'rolling on the floor laughing', aliases: ['rofl'], tags: ['funny', 'laughing'] },
  { emoji: '😂', description: 'face with tears of joy', aliases: ['joy'], tags: ['happy', 'tears'] },
  { emoji: '🙂', description: 'slightly smiling face', aliases: ['slightly_smiling_face'], tags: ['smile'] },
  { emoji: '🙃', description: 'upside down face', aliases: ['upside_down_face'], tags: ['flipped'] },
  { emoji: '😉', description: 'winking face', aliases: ['wink'], tags: ['flirt'] },
  { emoji: '😊', description: 'smiling face with smiling eyes', aliases: ['blush'], tags: ['smile', 'happy'] },
  { emoji: '😇', description: 'smiling face with halo', aliases: ['innocent'], tags: ['angel'] },
  
  // Love & Hearts
  { emoji: '🥰', description: 'smiling face with hearts', aliases: ['smiling_face_with_three_hearts'], tags: ['love'] },
  { emoji: '😍', description: 'smiling face with heart-eyes', aliases: ['heart_eyes'], tags: ['love', 'crush'] },
  { emoji: '🤩', description: 'star-struck', aliases: ['star_struck'], tags: ['eyes'] },
  { emoji: '😘', description: 'face blowing a kiss', aliases: ['kissing_heart'], tags: ['love', 'kiss'] },
  { emoji: '😗', description: 'kissing face', aliases: ['kissing'], tags: ['love', 'kiss'] },
  { emoji: '☺️', description: 'smiling face', aliases: ['relaxed'], tags: ['blush', 'pleased'] },
  { emoji: '😚', description: 'kissing face with closed eyes', aliases: ['kissing_closed_eyes'], tags: ['love', 'kiss'] },
  { emoji: '😙', description: 'kissing face with smiling eyes', aliases: ['kissing_smiling_eyes'], tags: ['kiss'] },
  
  // Playful
  { emoji: '😋', description: 'face savoring food', aliases: ['yum'], tags: ['tongue', 'lick'] },
  { emoji: '😛', description: 'face with tongue', aliases: ['stuck_out_tongue'], tags: ['prank', 'childish'] },
  { emoji: '😜', description: 'winking face with tongue', aliases: ['stuck_out_tongue_winking_eye'], tags: ['prank', 'childish'] },
  { emoji: '🤪', description: 'zany face', aliases: ['zany_face'], tags: ['goofy', 'wacky'] },
  { emoji: '😝', description: 'squinting face with tongue', aliases: ['stuck_out_tongue_closed_eyes'], tags: ['prank'] },
  
  // Neutral & Thoughtful  
  { emoji: '🤑', description: 'money-mouth face', aliases: ['money_mouth_face'], tags: ['rich'] },
  { emoji: '🤗', description: 'hugging face', aliases: ['hugs'], tags: ['hug'] },
  { emoji: '🤭', description: 'face with hand over mouth', aliases: ['hand_over_mouth'], tags: ['quiet', 'hush'] },
  { emoji: '🤫', description: 'shushing face', aliases: ['shushing_face'], tags: ['quiet', 'hush'] },
  { emoji: '🤔', description: 'thinking face', aliases: ['thinking'], tags: ['hmmm', 'think', 'consider'] },
  
  // Sad & Worried
  { emoji: '🤐', description: 'zipper-mouth face', aliases: ['zipper_mouth_face'], tags: ['silence', 'hush'] },
  { emoji: '🤨', description: 'face with raised eyebrow', aliases: ['raised_eyebrow'], tags: ['suspicious'] },
  { emoji: '😐', description: 'neutral face', aliases: ['neutral_face'], tags: ['meh'] },
  { emoji: '😑', description: 'expressionless face', aliases: ['expressionless'], tags: ['blank', 'meh'] },
  { emoji: '😶', description: 'face without mouth', aliases: ['no_mouth'], tags: ['mute', 'silence'] },
  { emoji: '😏', description: 'smirking face', aliases: ['smirk'], tags: ['smug'] },
  { emoji: '😒', description: 'unamused face', aliases: ['unamused'], tags: ['meh'] },
  { emoji: '🙄', description: 'face with rolling eyes', aliases: ['roll_eyes'], tags: ['sarcastic'] },
  { emoji: '😬', description: 'grimacing face', aliases: ['grimacing'], tags: ['ehh', 'nervous'] },
  { emoji: '🤥', description: 'lying face', aliases: ['lying_face'], tags: ['liar'] },
  { emoji: '😔', description: 'pensive face', aliases: ['pensive'], tags: ['sad', 'depressed'] },
  { emoji: '😕', description: 'confused face', aliases: ['confused'], tags: ['puzzled'] },
  { emoji: '🙁', description: 'slightly frowning face', aliases: ['slightly_frowning_face'], tags: ['disappointed'] },
  { emoji: '☹️', description: 'frowning face', aliases: ['frowning_face'], tags: ['sad'] },
  { emoji: '😣', description: 'persevering face', aliases: ['persevere'], tags: ['struggling'] },
  { emoji: '😖', description: 'confounded face', aliases: ['confounded'], tags: ['confused'] },
  { emoji: '😫', description: 'tired face', aliases: ['tired_face'], tags: ['sick', 'whine'] },
  { emoji: '😩', description: 'weary face', aliases: ['weary'], tags: ['tired'] },
  { emoji: '🥺', description: 'pleading face', aliases: ['pleading_face'], tags: ['puppy', 'eyes'] },
  { emoji: '😢', description: 'crying face', aliases: ['cry'], tags: ['sad', 'tear'] },
  { emoji: '😭', description: 'loudly crying face', aliases: ['sob'], tags: ['sad', 'cry', 'bawling'] },
  
  // Animals & Nature
  { emoji: '🐶', description: 'dog face', aliases: ['dog'], tags: ['animal', 'friend', 'nature', 'woof', 'puppy', 'pet'] },
  { emoji: '🐱', description: 'cat face', aliases: ['cat'], tags: ['animal', 'meow', 'pet'] },
  { emoji: '🐭', description: 'mouse face', aliases: ['mouse'], tags: ['animal'] },
  { emoji: '🐹', description: 'hamster face', aliases: ['hamster'], tags: ['animal'] },
  { emoji: '🐰', description: 'rabbit face', aliases: ['rabbit'], tags: ['animal', 'bunny'] },
  { emoji: '🦊', description: 'fox face', aliases: ['fox_face'], tags: ['animal'] },
  { emoji: '🐻', description: 'bear face', aliases: ['bear'], tags: ['animal'] },
  { emoji: '🐼', description: 'panda face', aliases: ['panda_face'], tags: ['animal', 'nature'] },
  
  // Food & Drink
  { emoji: '🍎', description: 'red apple', aliases: ['apple'], tags: ['fruit', 'mac'] },
  { emoji: '🍊', description: 'tangerine', aliases: ['tangerine', 'orange'], tags: ['fruit'] },
  { emoji: '🍌', description: 'banana', aliases: ['banana'], tags: ['fruit', 'food'] },
  { emoji: '🍓', description: 'strawberry', aliases: ['strawberry'], tags: ['fruit', 'food'] },
  { emoji: '🍇', description: 'grapes', aliases: ['grapes'], tags: ['fruit', 'food'] },
  { emoji: '🍉', description: 'watermelon', aliases: ['watermelon'], tags: ['fruit', 'food'] },
  { emoji: '🍑', description: 'cherries', aliases: ['cherries'], tags: ['fruit', 'food'] },
  { emoji: '🍒', description: 'cherries', aliases: ['cherries'], tags: ['fruit', 'food'] },
  { emoji: '🥝', description: 'kiwi fruit', aliases: ['kiwi_fruit'], tags: ['fruit', 'food'] },
  { emoji: '🍅', description: 'tomato', aliases: ['tomato'], tags: ['fruit', 'vegetable'] },
  { emoji: '🥕', description: 'carrot', aliases: ['carrot'], tags: ['vegetable', 'food'] },
  { emoji: '🌽', description: 'ear of corn', aliases: ['corn'], tags: ['food', 'vegetable'] },
  { emoji: '🌶️', description: 'hot pepper', aliases: ['hot_pepper'], tags: ['food', 'spicy'] },
  { emoji: '🥒', description: 'cucumber', aliases: ['cucumber'], tags: ['vegetable', 'food'] },
  { emoji: '🥬', description: 'leafy greens', aliases: ['leafy_greens'], tags: ['vegetable', 'food'] },
  { emoji: '🥦', description: 'broccoli', aliases: ['broccoli'], tags: ['vegetable'] },
  
  // Objects & Symbols
  { emoji: '❤️', description: 'red heart', aliases: ['heart'], tags: ['love', 'like'] },
  { emoji: '🧡', description: 'orange heart', aliases: ['orange_heart'], tags: ['love'] },
  { emoji: '💛', description: 'yellow heart', aliases: ['yellow_heart'], tags: ['love'] },
  { emoji: '💚', description: 'green heart', aliases: ['green_heart'], tags: ['love'] },
  { emoji: '💙', description: 'blue heart', aliases: ['blue_heart'], tags: ['love'] },
  { emoji: '💜', description: 'purple heart', aliases: ['purple_heart'], tags: ['love'] },
  { emoji: '🖤', description: 'black heart', aliases: ['black_heart'], tags: ['evil'] },
  { emoji: '🤍', description: 'white heart', aliases: ['white_heart'], tags: ['pure'] },
  { emoji: '🤎', description: 'brown heart', aliases: ['brown_heart'], tags: ['love'] },
  { emoji: '💔', description: 'broken heart', aliases: ['broken_heart'], tags: ['sad', 'sorry'] },
  { emoji: '❣️', description: 'heavy heart exclamation', aliases: ['heavy_heart_exclamation'], tags: ['love'] },
  { emoji: '💕', description: 'two hearts', aliases: ['two_hearts'], tags: ['love'] },
  { emoji: '💞', description: 'revolving hearts', aliases: ['revolving_hearts'], tags: ['love'] },
  { emoji: '💓', description: 'beating heart', aliases: ['heartbeat'], tags: ['love', 'nervous'] },
  { emoji: '💗', description: 'growing heart', aliases: ['heartpulse'], tags: ['love', 'nervous'] },
  { emoji: '💖', description: 'sparkling heart', aliases: ['sparkling_heart'], tags: ['love', 'affection'] },
  { emoji: '💘', description: 'heart with arrow', aliases: ['cupid'], tags: ['love', 'heart'] },
  { emoji: '💝', description: 'heart with ribbon', aliases: ['gift_heart'], tags: ['love', 'chocolates'] },
  
  // Activities & Sports
  { emoji: '⚽', description: 'soccer ball', aliases: ['soccer'], tags: ['sports', 'football'] },
  { emoji: '🏀', description: 'basketball', aliases: ['basketball'], tags: ['sports'] },
  { emoji: '🏈', description: 'american football', aliases: ['football'], tags: ['sports'] },
  { emoji: '⚾', description: 'baseball', aliases: ['baseball'], tags: ['sports'] },
  { emoji: '🥎', description: 'softball', aliases: ['softball'], tags: ['sports'] },
  { emoji: '🎾', description: 'tennis', aliases: ['tennis'], tags: ['sports'] },
  { emoji: '🏐', description: 'volleyball', aliases: ['volleyball'], tags: ['sports'] },
  { emoji: '🏉', description: 'rugby football', aliases: ['rugby_football'], tags: ['sports'] },
  { emoji: '🥏', description: 'flying disc', aliases: ['flying_disc'], tags: ['sports'] },
  { emoji: '🎱', description: 'pool 8 ball', aliases: ['8ball'], tags: ['pool', 'hobby'] },
  { emoji: '🪀', description: 'yo-yo', aliases: ['yo_yo'], tags: ['toy'] },
  
  // Common expressions & gestures
  { emoji: '🔥', description: 'fire', aliases: ['fire'], tags: ['hot', 'cook', 'flame'] },
  { emoji: '✨', description: 'sparkles', aliases: ['sparkles'], tags: ['shiny', 'diamonds'] },
  { emoji: '⭐', description: 'star', aliases: ['star'], tags: ['night', 'yellow'] },
  { emoji: '🌟', description: 'glowing star', aliases: ['star2'], tags: ['night', 'sparkle', 'awesome'] },
  { emoji: '💫', description: 'dizzy', aliases: ['dizzy'], tags: ['sparkle', 'shooting'] },
  { emoji: '⚡', description: 'high voltage', aliases: ['zap'], tags: ['lightning', 'thunder'] },
  { emoji: '☄️', description: 'comet', aliases: ['comet'], tags: ['space'] },
  { emoji: '💥', description: 'collision', aliases: ['boom', 'collision'], tags: ['bomb'] },
  
  // Weather
  { emoji: '🌈', description: 'rainbow', aliases: ['rainbow'], tags: ['nature', 'happy', 'unicorn_face'] },
  { emoji: '☀️', description: 'sun', aliases: ['sunny'], tags: ['weather', 'nature', 'brightness', 'summer'] },
  { emoji: '🌤️', description: 'sun behind small cloud', aliases: ['partly_sunny'], tags: ['weather', 'nature'] },
  { emoji: '⛅', description: 'sun behind cloud', aliases: ['partly_sunny'], tags: ['weather', 'nature'] },
  { emoji: '🌥️', description: 'sun behind large cloud', aliases: ['mostly_sunny'], tags: ['weather'] },
  { emoji: '☁️', description: 'cloud', aliases: ['cloud'], tags: ['weather', 'sky'] },
  { emoji: '🌦️', description: 'sun behind rain cloud', aliases: ['partly_sunny_rain'], tags: ['weather'] },
  { emoji: '🌧️', description: 'cloud with rain', aliases: ['rain_cloud'], tags: ['weather'] },
  { emoji: '⛈️', description: 'cloud with lightning and rain', aliases: ['thunder_cloud_and_rain'], tags: ['weather'] },
  { emoji: '🌩️', description: 'cloud with lightning', aliases: ['lightning_cloud'], tags: ['weather'] },
  
  // Common objects
  { emoji: '🚀', description: 'rocket', aliases: ['rocket'], tags: ['space', 'fly'] },
  { emoji: '🎉', description: 'party popper', aliases: ['tada'], tags: ['party', 'congratulations'] },
  { emoji: '🎊', description: 'confetti ball', aliases: ['confetti_ball'], tags: ['party'] },
  { emoji: '🎈', description: 'balloon', aliases: ['balloon'], tags: ['party', 'birthday'] },
  { emoji: '🎁', description: 'wrapped gift', aliases: ['gift'], tags: ['party', 'christmas', 'birthday'] },
  { emoji: '🎂', description: 'birthday cake', aliases: ['birthday'], tags: ['party'] }
];

export default emojiList;
