import { QuestionSet, Topic, Question } from '../types';

export const QUESTION_SETS: QuestionSet[] = [
  {
    id: 'set-1',
    title: 'Set 1: School rules & Working in the legal profession',
    description: '3 questions on school rules & discipline, followed by 3 questions on working in the legal profession.',
    topics: [
      {
        id: 'school-rules',
        title: 'School rules',
        introText: "Let's start with the first topic: School rules",
      },
      {
        id: 'legal-profession',
        title: 'Working in the legal profession',
        introText: "Let's move on to the second topic: Working in the legal profession",
      },
    ],
    questions: [
      {
        id: 1,
        topicId: 'school-rules',
        topicTitle: 'School rules',
        introAudioText: "Let's start with the first topic: School rules",
        questionText: 'What kinds of rules are common in a school?',
        modelAnswer: 'Well, most educational institutions establish rules regarding punctuality, dress code or uniform, and classroom decorum to maintain a structured environment. Additionally, there are almost always strict guidelines prohibiting disruptive behavior, bullying, and cheating during examinations, which ensures that all students have a fair and safe space to learn.',
        bandExplanation: 'Band 7.5 Justification: Speaks fluently using topical collocations ("educational institutions", "classroom decorum", "disruptive behavior") and complex sentence structures ("which ensures that all students...").',
        keyVocabulary: [
          { word: 'Classroom decorum', meaning: 'Appropriate and respectful behavior in class' },
          { word: 'Punctuality', meaning: 'The habit of arriving on time' },
          { word: 'Disruptive behavior', meaning: 'Actions that disturb or interrupt learning' },
        ],
        examinerTip: 'Categorize your points (e.g. academic rules vs personal behavior) to structure your Part 3 response logically.'
      },
      {
        id: 2,
        topicId: 'school-rules',
        topicTitle: 'School rules',
        questionText: 'How important is it to have rules in a school?',
        modelAnswer: 'I believe having clear regulations is essential because it provides a safe and orderly framework for students. Without established boundaries, schools could easily descend into chaos, making effective teaching nearly impossible. Furthermore, adhering to rules instills fundamental values like self-discipline and respect for authority, which are crucial for students as they transition into adulthood.',
        bandExplanation: 'Band 7.5 Justification: Strong coherence with discourse connectors ("Without established boundaries", "Furthermore"). Uses strong academic verbs and phrases ("descend into chaos", "instills fundamental values").',
        keyVocabulary: [
          { word: 'Orderly framework', meaning: 'A well-structured and safe environment' },
          { word: 'Adhering to', meaning: 'Following or obeying rules strictly' },
          { word: 'Instill values', meaning: 'Gradually establish firm principles or ideas' },
        ],
        examinerTip: 'Use conditional or hypothetical structures (e.g., "Without rules, schools could...") to demonstrate grammatical flexibility.'
      },
      {
        id: 3,
        topicId: 'school-rules',
        topicTitle: 'School rules',
        questionText: 'What do you recommend should happen if children break school rules?',
        modelAnswer: 'Rather than relying solely on punitive measures like suspensions, I recommend adopting a restorative justice approach. Minor infractions could be addressed through constructive warnings, detention, or community service where students reflect on their mistakes. For more serious misconduct, counseling and parental involvement are vital to address the underlying causes rather than simply punishing the student.',
        bandExplanation: 'Band 7.5 Justification: Demonstrates advanced vocabulary ("restorative justice", "punitive measures", "minor infractions") and complex sentence framing ("Rather than relying solely on... I recommend...").',
        keyVocabulary: [
          { word: 'Restorative justice', meaning: 'Focusing on rehabilitation rather than punishment' },
          { word: 'Punitive measures', meaning: 'Disciplinary actions intended as punishment' },
          { word: 'Minor infractions', meaning: 'Small, non-serious rule breaches' },
        ],
        examinerTip: 'Propose balanced solutions using modal structures ("I recommend...", "could be addressed through...") to sound analytical.'
      },
      {
        id: 4,
        topicId: 'legal-profession',
        topicTitle: 'Working in the legal profession',
        introAudioText: "Let's move on to the second topic: Working in the legal profession",
        questionText: 'Can you suggest why many students decide to study law at university?',
        modelAnswer: 'I think there are two primary drivers. Firstly, law is widely perceived as a prestigious and intellectually stimulating field that opens doors to lucrative career paths, such as becoming a barrister or corporate attorney. Secondly, many young individuals are motivated by a strong sense of justice and a desire to uphold human rights or protect vulnerable members of society.',
        bandExplanation: 'Band 7.5 Justification: Excellent paragraph structure using signposting ("Firstly", "Secondly"). High-level vocabulary ("intellectually stimulating", "lucrative career paths", "uphold human rights").',
        keyVocabulary: [
          { word: 'Prestigious', meaning: 'Inspiring respect and high standing' },
          { word: 'Lucrative', meaning: 'Producing a great deal of profit or wealth' },
          { word: 'Uphold human rights', meaning: 'Defend and maintain fundamental freedoms' },
        ],
        examinerTip: 'Signpost your main reasons clearly using phrases like "There are two primary drivers" or "Firstly... Secondly...".'
      },
      {
        id: 5,
        topicId: 'legal-profession',
        topicTitle: 'Working in the legal profession',
        questionText: 'What are the key personal qualities needed to be a successful lawyer?',
        modelAnswer: 'In my view, exceptional analytical skills and persuasive communication are paramount, as legal practitioners must digest complex legislation and present logical arguments in court. Additionally, high emotional resilience and meticulous attention to detail are crucial for dealing with heavy workloads, scrutinizing contracts, and managing high-stakes situations.',
        bandExplanation: 'Band 7.5 Justification: Precise legal vocabulary ("analytical skills", "persuasive communication", "digest complex legislation", "high-stakes situations"). Smooth, natural flow.',
        keyVocabulary: [
          { word: 'Paramount', meaning: 'More important than anything else' },
          { word: 'Meticulous', meaning: 'Showing great attention to detail and thoroughness' },
          { word: 'High-stakes', meaning: 'Involving major risks or serious consequences' },
        ],
        examinerTip: 'Group personality traits logically (e.g. cognitive skills vs emotional qualities) to demonstrate coherence.'
      },
      {
        id: 6,
        topicId: 'legal-profession',
        topicTitle: 'Working in the legal profession',
        questionText: 'Do you agree that working in the legal profession is very stressful?',
        modelAnswer: 'Yes, I completely agree. Lawyers routinely deal with immense pressure, long working hours, and tight court deadlines where a single oversight can lead to severe consequences for a client. Furthermore, emotionally demanding cases involving family disputes or criminal defense can take a heavy psychological toll, making burnout a very real issue in the legal field.',
        bandExplanation: 'Band 7.5 Justification: Clear position with well-developed justification. Collocations like "tight court deadlines", "psychological toll", and "emotional demanding cases" demonstrate Band 7.5+ lexical resource.',
        keyVocabulary: [
          { word: 'Severe consequences', meaning: 'Serious negative outcomes' },
          { word: 'Psychological toll', meaning: 'Negative impact on mental health and wellbeing' },
          { word: 'Burnout', meaning: 'Physical or mental collapse caused by overworked stress' },
        ],
        examinerTip: 'Express agreement clearly and elaborate with specific reasons (deadlines, high consequences, mental fatigue).'
      },
    ],
  },
  {
    id: 'set-2',
    title: 'Set 2: Driving a car & Electric cars',
    description: '3 questions on driving habits & road safety, followed by 3 questions on electric vehicles & future transport.',
    topics: [
      {
        id: 'driving-car',
        title: 'Driving a car',
        introText: "Let's start with the first topic: Driving a car",
      },
      {
        id: 'electric-cars',
        title: 'Electric cars',
        introText: "Let's move on to the second topic: Electric cars",
      },
    ],
    questions: [
      {
        id: 1,
        topicId: 'driving-car',
        topicTitle: 'Driving a car',
        introAudioText: "Let's start with the first topic: Driving a car",
        questionText: 'How interested are young people in your country in learning to drive?',
        modelAnswer: 'Generally speaking, obtaining a driver’s license is still seen as a major rite of passage for youth because it grants independence and personal mobility. Having said that, in urban centers with reliable public transportation, some young adults are delaying learning to drive due to high insurance premiums, fuel costs, and growing environmental awareness.',
        bandExplanation: 'Band 7.5 Justification: Uses natural discourse markers ("Generally speaking", "Having said that") to present a nuanced argument with contrasting perspectives.',
        keyVocabulary: [
          { word: 'Rite of passage', meaning: 'An event marking an important stage in life' },
          { word: 'Personal mobility', meaning: 'The ability to move around freely' },
          { word: 'Insurance premiums', meaning: 'Regular payments made for insurance coverage' },
        ],
        examinerTip: 'Balance your answer by discussing both enthusiastic youth and those who prefer public transit.'
      },
      {
        id: 2,
        topicId: 'driving-car',
        topicTitle: 'Driving a car',
        questionText: 'What are the differences between driving in the countryside and driving in the city?',
        modelAnswer: 'The primary distinction lies in traffic density and road conditions. City driving involves navigating heavy congestion, frequent stop-and-go traffic, pedestrian crossings, and tight parking spaces. Conversely, rural driving typically allows for higher speeds on open roads, but presents distinct hazards like unlit narrow lanes, sharp bends, and unexpected wildlife.',
        bandExplanation: 'Band 7.5 Justification: Rich comparative vocabulary ("primary distinction", "Conversely", "heavy congestion", "distinct hazards"). Flawless complex sentence structures.',
        keyVocabulary: [
          { word: 'Traffic density', meaning: 'The concentration of vehicles on a road' },
          { word: 'Conversely', meaning: 'In an opposite or contrasting way' },
          { word: 'Rural hazards', meaning: 'Dangers specific to countryside roads' },
        ],
        examinerTip: 'Use comparative linkers like "In contrast", "Conversely", and "Whereas city driving..." to highlight differences.'
      },
      {
        id: 3,
        topicId: 'driving-car',
        topicTitle: 'Driving a car',
        questionText: 'Do you consider most drivers where you live to be good drivers?',
        modelAnswer: 'On the whole, I’d say most motorists adhere to traffic rules and drive courteously. However, during peak rush hours, aggressive behaviors such as tailgating, speeding, and failing to signal can become quite prevalent. So while the majority are responsible, a careless minority can still make the roads feel hazardous.',
        bandExplanation: 'Band 7.5 Justification: Balanced evaluation using "On the whole", "However", and "So while...". Precise driving terminology ("tailgating", "prevalent", "hazardous").',
        keyVocabulary: [
          { word: 'Adhere to traffic rules', meaning: 'Follow road laws strictly' },
          { word: 'Tailgating', meaning: 'Driving dangerously close behind another vehicle' },
          { word: 'Prevalent', meaning: 'Widespread or common in a particular area' },
        ],
        examinerTip: 'Acknowledge both sides: the general law-abiding majority vs typical rush-hour traffic issues.'
      },
      {
        id: 4,
        topicId: 'electric-cars',
        topicTitle: 'Electric cars',
        introAudioText: "Let's move on to the second topic: Electric cars",
        questionText: 'How popular are electric cars in your country?',
        modelAnswer: 'Electric vehicles have seen a remarkable surge in popularity in recent years, largely driven by government subsidies and expanding charging infrastructure. While conventional gas-powered cars still dominate the market share, seeing EVs on urban roads and in public charging stations has become increasingly routine.',
        bandExplanation: 'Band 7.5 Justification: Topic-specific vocabulary ("remarkable surge", "government subsidies", "charging infrastructure", "dominate the market share"). Smooth flow.',
        keyVocabulary: [
          { word: 'Remarkable surge', meaning: 'A sudden, noticeable increase' },
          { word: 'Subsidies', meaning: 'Financial support granted by government' },
          { word: 'Market share', meaning: 'The portion of a market controlled by a product' },
        ],
        examinerTip: 'Discuss trends over time using present perfect ("have seen a remarkable surge", "has become routine").'
      },
      {
        id: 5,
        topicId: 'electric-cars',
        topicTitle: 'Electric cars',
        questionText: 'In what ways could more people be persuaded to buy electric cars?',
        modelAnswer: 'To encourage widespread adoption, governments could offer greater tax incentives and cash rebates to lower the upfront purchase price. Furthermore, expanding the network of fast-charging stations across rural areas and improving battery lifespan would help eliminate "range anxiety" for long-distance drivers.',
        bandExplanation: 'Band 7.5 Justification: Expresses recommendations using conditionals and modal verbs ("could offer", "would help eliminate"). High-level domain phrases like "range anxiety" and "widespread adoption".',
        keyVocabulary: [
          { word: 'Widespread adoption', meaning: 'Broad acceptance and usage across population' },
          { word: 'Tax incentives', meaning: 'Reductions in tax designed to encourage purchases' },
          { word: 'Range anxiety', meaning: 'Fear that an EV battery will run out before reaching a charger' },
        ],
        examinerTip: 'Mention both financial solutions (tax rebates, subsidies) and practical solutions (charging infrastructure, battery life).'
      },
      {
        id: 6,
        topicId: 'electric-cars',
        topicTitle: 'Electric cars',
        questionText: 'Do you think all cars will be electric one day?',
        modelAnswer: 'I anticipate that within the next few decades, electric power will become the dominant mode of personal transport, especially as many nations pledge to phase out combustion engines. However, achieving 100% global electrification may take much longer due to infrastructure deficits in developing nations and the potential emergence of alternative zero-emission technologies like hydrogen.',
        bandExplanation: 'Band 7.5 Justification: Advanced speculative grammar ("I anticipate that...", "may take much longer"). Sophisticated vocabulary ("combustion engines", "infrastructure deficits", "zero-emission technologies").',
        keyVocabulary: [
          { word: 'Phase out', meaning: 'Gradually discontinue the use or production of something' },
          { word: 'Electrification', meaning: 'The process of converting a system to electrical power' },
          { word: 'Infrastructure deficit', meaning: 'A lack of essential physical facilities' },
        ],
        examinerTip: 'Speculate about the future using nuanced terms like "I anticipate that...", "may take longer due to...", and "alternative zero-emission technologies".'
      },
    ],
  },
];

// Helper exports for default set
export const TOPICS: Topic[] = QUESTION_SETS[0].topics;
export const QUESTIONS: Question[] = QUESTION_SETS[0].questions;


