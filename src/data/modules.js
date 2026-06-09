export const modules = [
  {
    id: 1,
    title: "History of Buddhism",
    subtitle: "Origins & Spread",
    icon: "📜",
    color: "from-amber-800 to-amber-600",
    accentColor: "amber",
    description: "Discover the life of Siddhartha Gautama, the birth of Buddhism in ancient India, and how it spread across Asia over 2,500 years.",
    lessons: [
      {
        id: "1-1",
        title: "The Life of Siddhartha Gautama",
        content: `Siddhartha Gautama was born around 563 BCE in Lumbini (modern-day Nepal) into a wealthy royal family of the Shakya clan. His father, King Suddhodana, shielded him from all suffering, prophecying that the prince would either become a great king or a great spiritual teacher.

At 29, Siddhartha ventured outside the palace walls for the first time and encountered the "Four Sights": an old man, a sick person, a corpse, and a wandering ascetic. These encounters shook him deeply, confronting him with the reality of suffering (dukkha) in human life.

Moved by what he had witnessed, Siddhartha left his palace, wife, and newborn son in the middle of the night to seek the end of suffering. This pivotal event is known as the **Great Renunciation**.

For six years, Siddhartha practiced extreme asceticism with a group of five monks — starving himself, exposing himself to harsh weather, and holding his breath until he nearly died. Realizing that extreme self-mortification wasn't the path to liberation, he accepted a bowl of rice milk from a village girl named Sujata and abandoned asceticism.

At approximately 35 years old, Siddhartha sat beneath a Bodhi tree in Bodh Gaya, vowing not to rise until he had found enlightenment. After 49 days of meditation, he attained Nirvana — complete awakening. From that moment, he became the **Buddha**, meaning "the Awakened One."

The Buddha spent the next 45 years teaching across northeastern India until his death (Parinirvana) around 483 BCE at age 80 in Kushinagar.`,
      },
      {
        id: "1-2",
        title: "The Spread of Buddhism",
        content: `After the Buddha's death, his teachings (the Dharma) were preserved orally by his disciples. The First Buddhist Council, held shortly after his passing, gathered 500 monks to recite and standardize his teachings.

**Buddhism in India:** Emperor Ashoka (304–232 BCE) became the greatest patron of Buddhism after witnessing the devastation of war. He converted to Buddhism, built thousands of stupas and hospitals, and sent missionaries across Asia, including his own son Mahinda to Sri Lanka.

**Southern Buddhism (Theravada):** Buddhism spread through Sri Lanka, Myanmar, Thailand, Cambodia, and Laos. Theravada ("Way of the Elders") emphasizes the original Pali Canon and the path of the individual monk toward Nirvana.

**Northern Buddhism (Mahayana):** Buddhism spread through China, Korea, Japan, and Vietnam. Mahayana ("Great Vehicle") introduced the Bodhisattva ideal — the aspiration to attain enlightenment not just for oneself, but for all sentient beings.

**Vajrayana (Tibetan Buddhism):** Buddhism entered Tibet in the 7th century CE, blending with Tantric practices to create a rich tradition of visualization, mantra, and complex ritual. The Dalai Lama lineage began in the 14th century.

**Buddhism in the West:** Buddhism began spreading to Europe and America in the 19th and 20th centuries, partly through scholars, partly through Asian immigration, and partly through Western seekers. Today, Buddhism is practiced worldwide.`,
      },
      {
        id: "1-3",
        title: "The Three Major Schools",
        content: `Buddhism today exists in three main schools, each with distinct practices, texts, and geographical homes.

**Theravada — "The School of the Elders"**
The oldest surviving school, based on the Pali Canon (Tipitaka). Theravada emphasizes:
- Individual liberation through one's own effort
- The monk/nun (bhikkhu/bhikkhuni) as the ideal practitioner
- Vipassana (insight) and Samatha (calm) meditation
- Practiced primarily in: Sri Lanka, Thailand, Myanmar, Cambodia, Laos

**Mahayana — "The Great Vehicle"**
Emerged around 1st century BCE, emphasizing universal compassion. Mahayana emphasizes:
- The Bodhisattva ideal: vowing to attain enlightenment for all beings
- Rich philosophical traditions (Madhyamaka, Yogacara)
- Devotion to Bodhisattvas like Avalokiteshvara (Kuan Yin)
- Practiced primarily in: China, Japan, Korea, Vietnam, Taiwan

**Vajrayana — "The Diamond Vehicle"**
Also called Tantric or Esoteric Buddhism. Vajrayana emphasizes:
- Rapid path to enlightenment using mantra, mudra, and visualization
- Guru-disciple relationship is essential
- Complex deity practices and elaborate ritual
- The Dalai Lama as spiritual leader
- Practiced primarily in: Tibet, Mongolia, Bhutan, Nepal

Despite their differences, all three schools share the core teachings of the Buddha: the Four Noble Truths, the Eightfold Path, and the goal of liberation from suffering.`,
      },
    ],
    quiz: [
      {
        question: "Where was Siddhartha Gautama born?",
        options: ["Bodh Gaya, India", "Lumbini, Nepal", "Varanasi, India", "Kushinagar, India"],
        correct: 1,
      },
      {
        question: "What are the 'Four Sights' that prompted Siddhartha to leave the palace?",
        options: [
          "Fire, flood, famine, and war",
          "A king, a priest, a merchant, and a beggar",
          "An old man, a sick person, a corpse, and an ascetic",
          "The sun, moon, stars, and earth",
        ],
        correct: 2,
      },
      {
        question: "Which emperor greatly spread Buddhism across Asia?",
        options: ["Chandragupta", "Ashoka", "Harsha", "Vikramaditya"],
        correct: 1,
      },
      {
        question: "Theravada Buddhism is primarily practiced in which region?",
        options: ["East Asia (China, Japan)", "Southeast Asia (Thailand, Myanmar)", "Tibet and Mongolia", "Central Asia"],
        correct: 1,
      },
      {
        question: "What does 'Buddha' mean?",
        options: ["The Holy One", "The Peaceful One", "The Awakened One", "The Compassionate One"],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Core Teachings",
    subtitle: "Dharma & Philosophy",
    icon: "☸️",
    color: "from-orange-700 to-orange-500",
    accentColor: "orange",
    description: "Explore the Four Noble Truths, the Eightfold Path, the Three Marks of Existence, and the profound philosophy at the heart of Buddhism.",
    lessons: [
      {
        id: "2-1",
        title: "The Four Noble Truths",
        content: `The Four Noble Truths are the foundation of all Buddhist teaching. The Buddha taught them in his very first sermon at Deer Park in Sarnath, shortly after his enlightenment. They are a diagnosis, cause, prognosis, and cure for human suffering.

**1. Dukkha — The Truth of Suffering**
Life is characterized by dukkha — a Pali word often translated as "suffering," but more accurately meaning unsatisfactoriness, imperfection, or unease. Dukkha encompasses:
- Obvious suffering: pain, illness, loss, death
- The suffering of change: even pleasant experiences end
- The suffering of conditioned existence: the subtle dissatisfaction underlying all experience

**2. Samudaya — The Truth of the Origin of Suffering**
Suffering arises from craving (tanha): craving for sensual pleasure, craving for existence, and craving for non-existence. This craving, rooted in ignorance of the true nature of reality, drives the cycle of rebirth (samsara).

**3. Nirodha — The Truth of the Cessation of Suffering**
Suffering can end. Complete liberation — Nirvana — is possible. Nirvana is the extinguishing of craving and the freedom from the cycle of suffering. It is not nothingness, but a profound peace beyond ordinary conception.

**4. Magga — The Truth of the Path**
There is a path leading to the cessation of suffering: the Noble Eightfold Path. This is the "Middle Way" between extreme asceticism and sensual indulgence — a practical guide to ethical living and mental cultivation.

The Four Noble Truths are structured like a medical diagnosis: the doctor (Buddha) identifies the disease (suffering), its cause (craving), declares it curable (Nirvana), and prescribes the treatment (the Eightfold Path).`,
      },
      {
        id: "2-2",
        title: "The Noble Eightfold Path",
        content: `The Noble Eightfold Path is the practical guide to ending suffering. It is divided into three sections: Wisdom (Prajna), Ethical Conduct (Sila), and Mental Cultivation (Samadhi).

**Wisdom (Prajna)**
1. **Right View** — Understanding the Four Noble Truths; seeing reality as it is, not through the distortions of craving and ignorance
2. **Right Intention** — Cultivating intentions of renunciation, non-ill-will, and non-cruelty; letting go of harmful motivations

**Ethical Conduct (Sila)**
3. **Right Speech** — Speaking truthfully, kindly, helpfully, and at the right time; avoiding lies, harsh words, divisive speech, and idle chatter
4. **Right Action** — Acting ethically: not killing, not stealing, not engaging in sexual misconduct
5. **Right Livelihood** — Earning a living through means that do not harm others; avoiding trades in weapons, living beings, meat, alcohol, or poisons

**Mental Cultivation (Samadhi)**
6. **Right Effort** — Cultivating wholesome mental states; preventing and abandoning harmful states; sustaining and developing wholesome ones
7. **Right Mindfulness** — Moment-to-moment awareness of the body, feelings, mind, and mental objects; the foundation of meditation
8. **Right Concentration** — Developing deep, one-pointed meditation (jhana); training the mind to be stable, clear, and focused

The path is called "noble" (ariya) because it leads to liberation and is followed by noble ones — those who have directly experienced the truth of the Dharma. The eight factors are not sequential steps but are practiced simultaneously and mutually support each other.`,
      },
      {
        id: "2-3",
        title: "The Three Marks of Existence",
        content: `The Three Marks of Existence (Tilakkhana in Pali) are three characteristics that the Buddha said apply to all conditioned phenomena. Understanding them deeply leads to liberation.

**1. Anicca — Impermanence**
Everything that arises passes away. Nothing lasts — not our bodies, thoughts, emotions, relationships, civilizations, or even the stars. This isn't a pessimistic view but a call to wake up: if everything changes, clinging to things as permanent causes unnecessary suffering. When we truly understand impermanence, we can appreciate each moment more fully and release our grip on what cannot last.

*Practice:* Notice throughout your day how everything is in constant flux — your breath, your moods, the temperature, sounds. Nothing stays exactly the same from moment to moment.

**2. Dukkha — Unsatisfactoriness**
As discussed in the Four Noble Truths, all conditioned existence has the quality of unsatisfactoriness. Even the most pleasant experience eventually fades or becomes tiresome. This is not to say life has no joy — it does — but that joy built on impermanent conditions cannot fully satisfy the deepest longing of the heart.

*Practice:* Instead of seeking permanent satisfaction in changing things, cultivate an equanimity that finds peace regardless of external circumstances.

**3. Anatta — Non-self**
This is perhaps the most radical and profound teaching of Buddhism. The Buddha taught that there is no fixed, permanent, independent self or soul. What we call "self" is actually a constantly changing process of five aggregates (skandhas): form, feeling, perception, mental formations, and consciousness.

This doesn't mean you don't exist — it means the self you cling to as permanent and independent is a constructed story, not an ultimate reality. Seeing through the illusion of a fixed self reduces the self-centered craving that causes suffering.

*Practice:* Ask "who am I?" deeply. Notice that what you call "I" is actually a flowing process of experiences rather than a solid, unchanging thing.`,
      },
    ],
    quiz: [
      {
        question: "What is the First Noble Truth?",
        options: ["Suffering can be ended", "There is suffering (dukkha)", "The path to end suffering", "Craving causes suffering"],
        correct: 1,
      },
      {
        question: "What are the three sections of the Eightfold Path?",
        options: [
          "Faith, Hope, and Charity",
          "Wisdom, Ethical Conduct, and Mental Cultivation",
          "Study, Practice, and Realization",
          "Meditation, Ethics, and Philosophy",
        ],
        correct: 1,
      },
      {
        question: "What does 'Anicca' mean?",
        options: ["Non-self", "Suffering", "Impermanence", "Compassion"],
        correct: 2,
      },
      {
        question: "According to the Second Noble Truth, what is the primary cause of suffering?",
        options: ["Ignorance", "Craving (tanha)", "Bad karma", "Wrong views"],
        correct: 1,
      },
      {
        question: "What is 'Anatta'?",
        options: ["The concept of rebirth", "The idea of non-self", "A type of meditation", "A Buddhist school"],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Buddhist Practice",
    subtitle: "Ethics & Daily Life",
    icon: "🙏",
    color: "from-teal-700 to-teal-500",
    accentColor: "teal",
    description: "Learn how Buddhism is lived: the Five Precepts, karma and rebirth, compassion practices, and how to bring the teachings into everyday life.",
    lessons: [
      {
        id: "3-1",
        title: "The Five Precepts",
        content: `The Five Precepts (Panca-sila) are the basic ethical guidelines for lay Buddhist practitioners. They are not commandments from an external authority but training rules that one voluntarily undertakes to reduce harm and cultivate inner peace.

**1. Panatipata veramani — Abstain from taking life**
This precept covers not killing any sentient being, including animals. It arises from compassion (karuna) — recognizing that all beings wish to live and be free from suffering. In practice, many Buddhists adopt vegetarianism or veganism, though this is not required in all traditions.

**2. Adinnadana veramani — Abstain from taking what is not given**
This means not stealing, but also not taking advantage of others, cheating, or defrauding. It cultivates generosity (dana) as the positive expression.

**3. Kamesu micchacara veramani — Abstain from sexual misconduct**
This precept covers avoiding sexual behaviors that cause harm — adultery, exploitation, or coercion. It doesn't prohibit sexuality but calls for responsibility, honesty, and care for all involved.

**4. Musavada veramani — Abstain from false speech**
This includes not lying, but also harsh speech, divisive speech, and empty gossip. The positive expression is right speech — speaking truthfully, kindly, and helpfully.

**5. Sura-meraya-majja-pamadatthana veramani — Abstain from intoxicants**
Avoiding alcohol and recreational drugs that cloud the mind and lead to heedlessness. The positive expression is mindfulness — cultivating clarity and awareness.

These five precepts form the foundation of ethical Buddhist life. Taking them seriously creates the internal stability necessary for meditation and wisdom to develop. Many practitioners recite them daily as a commitment to living with integrity.`,
      },
      {
        id: "3-2",
        title: "Karma and Rebirth",
        content: `**Karma** (Sanskrit) or **Kamma** (Pali) is one of Buddhism's most misunderstood concepts. It literally means "action" or "deed." In the Buddhist understanding, karma refers specifically to intentional actions and their results.

**How Karma Works**
Karma is not fate or predestination. It's the law of cause and effect applied to intentional actions. Every intentional action plants a seed that will eventually ripen as an experience. Virtuous actions (dana, sila, bhavana — generosity, ethics, meditation) create pleasant results; harmful actions create unpleasant results.

The key word is "intentional." An accidental action creates little or no karma, while a deliberate one carries full karmic weight. The Buddha emphasized that karma is rooted in intention (cetana): "It is intention that I call karma."

**Three Types of Karma**
- **Bodily karma:** physical actions
- **Verbal karma:** speech and communication
- **Mental karma:** thoughts, intentions, and attitudes

**Rebirth (Samsara)**
Buddhism teaches that beings are reborn repeatedly across many lifetimes. This cycle of birth, death, and rebirth is called samsara. The force that drives rebirth is craving and ignorance — the same root cause of suffering. Karma shapes the conditions of future lives.

**Important distinctions from Hinduism:** Buddhism does not accept a permanent soul (atman) that travels from life to life. Instead, what continues is a stream of consciousness — conditioned by karma — without a fixed self.

**Liberation:** The goal of Buddhist practice is to escape samsara entirely through the complete cessation of craving and ignorance — Nirvana. At that point, the cycle of rebirth ends.`,
      },
      {
        id: "3-3",
        title: "Compassion and Loving-Kindness",
        content: `Buddhism places enormous emphasis on developing compassion (karuna) and loving-kindness (metta) — not just as emotions, but as a systematic practice that transforms the heart and mind.

**Metta — Loving-Kindness**
Metta is the wish for all beings to be happy and free from suffering. It begins with oneself — because you cannot give what you don't have — and gradually expands outward to include loved ones, neutral people, difficult people, and ultimately all beings everywhere.

The Metta Sutta says: "Just as a mother would protect her only child with her own life, even so let one cultivate a boundless love towards all beings."

**Karuna — Compassion**
Karuna is the wish for beings to be free from suffering, accompanied by a heartfelt response to suffering when we encounter it. True compassion is active — it motivates us to help.

**Mudita — Sympathetic Joy**
The ability to take joy in others' happiness and success. It is the antidote to envy and jealousy — a radical expansion of our sense of "we."

**Upekkha — Equanimity**
The ability to remain balanced and non-reactive amid life's ups and downs — neither clinging to pleasant experiences nor pushing away unpleasant ones.

These four are called the **Brahmaviharas** or "Divine Abodes" — the four boundless qualities of an awakened heart.

**Metta Meditation Practice:**
Begin by sitting quietly and breathing deeply. Silently repeat:
- "May I be happy. May I be healthy. May I be peaceful. May I be free from suffering."
- Then direct these wishes to a loved one, a neutral person, a difficult person, and finally all beings everywhere.

Even 5–10 minutes of metta practice daily can measurably shift how you relate to yourself and others.`,
      },
    ],
    quiz: [
      {
        question: "How many precepts are in the basic Buddhist ethical guidelines for laypeople?",
        options: ["3", "5", "8", "10"],
        correct: 1,
      },
      {
        question: "What does 'karma' literally mean?",
        options: ["Fate", "Action", "Justice", "Rebirth"],
        correct: 1,
      },
      {
        question: "What are the Four Brahmaviharas (Divine Abodes)?",
        options: [
          "Faith, Hope, Charity, and Patience",
          "Loving-kindness, Compassion, Sympathetic Joy, and Equanimity",
          "Wisdom, Ethics, Meditation, and Liberation",
          "Generosity, Virtue, Patience, and Energy",
        ],
        correct: 1,
      },
      {
        question: "What drives the cycle of rebirth (samsara) in Buddhism?",
        options: ["Sin and punishment", "Craving and ignorance", "Fate and destiny", "Divine will"],
        correct: 1,
      },
      {
        question: "What does 'metta' mean?",
        options: ["Compassion", "Wisdom", "Loving-kindness", "Equanimity"],
        correct: 2,
      },
    ],
  },
  {
    id: 4,
    title: "Meditation",
    subtitle: "Mind Training & Mindfulness",
    icon: "🧘",
    color: "from-purple-800 to-purple-600",
    accentColor: "purple",
    description: "Step into direct practice. Learn the foundations of mindfulness, breathing meditation, and insight practice — and begin your own journey inward.",
    lessons: [
      {
        id: "4-1",
        title: "What is Meditation?",
        content: `Meditation (bhavana in Pali, meaning "cultivation" or "development") is the systematic training of the mind. In Buddhism, meditation is not relaxation (though it can be relaxing), not daydreaming, and not a blank-mind state. It is disciplined attention — learning to see clearly.

**Two Main Types of Buddhist Meditation**

**Samatha — Calm Abiding**
Samatha meditation develops concentration, stillness, and mental tranquility. The meditator focuses on a single object — most commonly the breath — and repeatedly brings attention back whenever the mind wanders. Over time, this builds powerful one-pointed concentration (samadhi) and a deep sense of inner peace.

Benefits: reduced anxiety, greater emotional stability, enhanced focus, and the development of jhana (meditative absorption).

**Vipassana — Insight Meditation**
Vipassana means "clear seeing" or "insight." Using the concentration developed in samatha as a foundation, the meditator investigates the nature of experience — observing impermanence, suffering, and non-self directly in one's own mind and body.

Benefits: seeing through the illusions that cause suffering; developing wisdom; ultimately, liberation.

**Mindfulness (Sati)**
Mindfulness — present-moment, non-judgmental awareness — is the key quality in both types of meditation and in daily life. The Buddha taught four foundations of mindfulness:
1. Mindfulness of the body
2. Mindfulness of feelings (pleasant, unpleasant, neutral)
3. Mindfulness of mind states
4. Mindfulness of mental objects (including the teachings themselves)

Modern mindfulness practices (MBSR, etc.) are largely derived from the Buddhist mindfulness tradition, particularly Theravada Vipassana.`,
      },
      {
        id: "4-2",
        title: "Breathing Meditation (Anapanasati)",
        content: `Anapanasati — "mindfulness of breathing" — is perhaps the most universally taught Buddhist meditation. The Buddha himself is said to have used it the night of his enlightenment. It's simple, accessible anywhere, and profoundly effective.

**Basic Instruction**

1. **Posture:** Sit comfortably — on a cushion cross-legged, in a chair, or kneeling. Keep your spine gently upright. Rest your hands on your knees or in your lap. Close your eyes or gently lower your gaze.

2. **Find the breath:** Bring your attention to the natural sensation of breathing. Notice the breath wherever it is most vivid for you — the nostrils (the subtle touch of air entering and leaving), the chest (rising and falling), or the abdomen (expanding and contracting).

3. **Stay with it:** Simply observe the breath — its texture, rhythm, depth. You don't need to control it. Let it be natural.

4. **When the mind wanders:** Inevitably, thoughts will arise. This is normal — it's what minds do. When you notice the mind has wandered, gently, kindly return attention to the breath. No frustration, no judgment — just begin again. This act of noticing and returning IS the meditation.

5. **Length:** Start with 5–10 minutes. Work up to 20–30 minutes daily.

**The Power of Return**
Every time you notice your mind has wandered and you bring it back, you are strengthening the "muscle" of mindfulness. The wandering is not the problem — it's the raw material of practice. Ten thousand returns to the breath is ten thousand moments of awakening.

**Tips:**
- Try counting breaths 1–10 to build focus
- Note "in... out..." silently as you breathe
- If you lose count, just start over at 1 — no self-criticism`,
      },
      {
        id: "4-3",
        title: "Living Mindfully",
        content: `Meditation is the formal training ground, but the real practice is life itself. The Buddha taught that mindfulness should extend into every moment — eating, walking, working, speaking, relating to others.

**Informal Mindfulness Practices**

**Mindful Eating**
Before a meal, pause for a moment and look at your food. Consider its origins — the farmers, the soil, the rain, the sunlight, the countless hands involved. Eat slowly, tasting each bite. Put down your utensils between mouthfuls. Notice when you're full.

**Mindful Walking (Kinhin)**
Walking meditation is a formal practice in many Buddhist traditions. Walk slowly, feeling each step — the lifting, moving, and placing of each foot. Feel the ground beneath you. Notice the sensations in your body. You can practice this in daily life too — walking to the car, to a meeting, or around the block.

**Mindful Listening**
When someone speaks to you, give them your full attention. Notice when your mind plans your response instead of truly listening. Try to hear not just the words but the feeling behind them.

**Pausing Throughout the Day**
Set a reminder to pause once an hour. Take three conscious breaths. Notice where you are, what you're doing, how you're feeling. This brief moment of mindfulness is like a reset button.

**Working with Difficult Emotions**
When strong emotions arise — anger, fear, anxiety — try this: Stop. Breathe. Name it: "There is anger here." Feel it in the body without acting on it or suppressing it. Watch it rise, peak, and fall like a wave. This practice — recognizing emotions without being swept away by them — is at the heart of Buddhist psychological work.

**The Goal**
The goal of practice is not to become a "meditator" who sits on a cushion. It's to cultivate an awakened heart and clear mind that meets each moment of life with wisdom, compassion, and presence.`,
      },
    ],
    quiz: [
      {
        question: "What does 'bhavana' (meditation) mean in Pali?",
        options: ["Stillness", "Cultivation or development", "Breathing", "Insight"],
        correct: 1,
      },
      {
        question: "What is 'Vipassana'?",
        options: ["Breathing exercises", "Chanting practice", "Insight meditation", "Walking meditation"],
        correct: 2,
      },
      {
        question: "What is 'Anapanasati'?",
        options: ["Loving-kindness meditation", "Mindfulness of breathing", "Body scan meditation", "Visualization practice"],
        correct: 1,
      },
      {
        question: "What are the Four Foundations of Mindfulness?",
        options: [
          "Breath, body, mind, and wisdom",
          "Body, feelings, mind states, and mental objects",
          "Sitting, walking, eating, and speaking",
          "Morning, noon, evening, and night practice",
        ],
        correct: 1,
      },
      {
        question: "What is 'Samatha' meditation primarily focused on developing?",
        options: ["Insight into impermanence", "Compassion for others", "Concentration and calm", "Knowledge of Buddhist texts"],
        correct: 2,
      },
    ],
  },
];
