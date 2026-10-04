(() => {
  "use strict";

  const STORAGE_KEY = "majaliwa-school-demo-language";
  const translations = {
    en: {
        alt001: "Students learning together in a bright classroom",
        alt002: "Young student reading in a sunlit learning space",
        alt003: "Preschool children exploring together",
        alt004: "Primary learners working together in class",
        alt005: "Teenage students collaborating on a school project",
        alt006: "Students sharing ideas as part of a group activity",
        alt007: "Bright, welcoming school classroom",
        alt008: "Student exploring a science experiment",
        alt009: "Bookshelves in a calm school library",
        alt010: "Children playing a team sport outdoors",
        alt011: "Colourful art materials ready for student creativity",
        alt012: "Green garden space surrounded by trees",
        alt013: "Demo portrait of Ms. Amina Hassan, Primary Education",
        alt014: "Demo portrait of Mr. Daniel Joseph, Science & Mathematics",
        alt015: "Demo portrait of Ms. Neema Peter, Languages & Humanities",
        alt016: "Demo portrait of Mr. Samuel John, ICT & Technology",
        alt017: "Green campus grounds and welcoming school building",
        alt018: "Well-lit classroom with a welcoming learning environment",
        alt019: "Students learning together in class",
        alt020: "Young people playing a team sport outdoors",
        alt021: "Learners sharing a moment at a school community gathering",
        alt022: "Art materials ready for a creative student activity",
        label001: "Majaliwa International School home",
        label002: "Open navigation",
        label003: "Main navigation",
        label004: "Switch language to Kiswahili",
        label005: "Scroll to our philosophy",
        label006: "Learn about early years admissions",
        label007: "Learn about primary school admissions",
        label008: "Learn about secondary school admissions",
        label009: "Filter gallery by category",
        label010: "Contact Majaliwa demo on WhatsApp",
        label011: "Gallery image viewer",
        label012: "Close image viewer",
        label013: "Previous image",
        label014: "Next image",
        placeholder001: "e.g. Asha Mwakalinga",
        placeholder002: "Your phone number",
        placeholder003: "you@example.com",
        placeholder004: "What would you like to ask about?",
        placeholder005: "Write your message here…",
        caption001: "A welcoming campus — fictional demo image",
        caption002: "A bright classroom — fictional demo image",
        caption003: "Learning together — fictional demo image",
        caption004: "Play, movement and teamwork — fictional demo image",
        caption005: "A school community gathering — fictional demo image",
        caption006: "Creative activities — fictional demo image",
        text001: "Skip to main content",
        text002: "FICTIONAL SCHOOL WEBSITE DEMO · All school information is illustrative",
        text003: "INTERNATIONAL SCHOOL",
        text004: "Our school",
        text005: "Learning",
        text006: "Campus life",
        text007: "Admissions",
        text008: "Contact",
        text009: "Enquire now",
        text010: "A PLACE TO GROW",
        text011: "DAR ES SALAAM, TANZANIA",
        text012: "Empowering Young Minds<br>for a <em>Brighter Future</em>",
        text013: "At Majaliwa International School, we create a supportive learning environment where students develop knowledge, confidence, creativity and strong character.",
        text014: "Apply Now",
        text015: "Explore Our School",
        text016: "A fictional school concept created for demonstration purposes.",
        text017: "Learning with purpose",
        text018: "OUR PHILOSOPHY",
        text019: "Education should open doors—and help children find the courage to walk through them.",
        text020: "At Majaliwa, learning is more than what happens in a classroom. It is the confidence to ask questions, the care to listen, and the curiosity to see possibility in the world around us.",
        text021: "The story behind our school",
        text022: "Every learner belongs.",
        text023: "A SCHOOL WITH A BIG HEART",
        text024: "Rooted here.<br><em>Ready for anywhere.</em>",
        text025: "Majaliwa International School is a fictional, family-centred school concept imagined for Dar es Salaam. Its name means “blessings”—a reminder of the potential in every child and the shared responsibility to help it flourish.",
        text026: "OUR VISION",
        text027: "Confident learners, compassionate citizens.",
        text028: "To nurture a generation ready to contribute with imagination, integrity and a global outlook.",
        text029: "OUR MISSION",
        text030: "Make room for every kind of brilliance.",
        text031: "To create a caring, engaging environment where strong foundations and joyful discovery go hand in hand.",
        text032: "WHAT GUIDES US",
        text033: "Curiosity",
        text034: "Kindness",
        text035: "Courage",
        text036: "Integrity",
        text037: "Belonging",
        text038: "LEARNING, STEP BY STEP",
        text039: "A strong start.<br><em>Room to soar.</em>",
        text040: "Thoughtful learning journeys meet children where they are—and help them discover what they can become.",
        text041: "AGES 3–5 · SAMPLE",
        text042: "Early years",
        text043: "Playful beginnings that build language, confidence, friendship and a love of discovery.",
        text044: "AGES 6–11 · SAMPLE",
        text045: "Primary school",
        text046: "A rich foundation in literacy, numeracy, science and the habits of independent learning.",
        text047: "AGES 12–17 · SAMPLE",
        text048: "Secondary school",
        text049: "Deeper inquiry, purposeful projects and support to shape an individual path forward.",
        text050: "Age ranges and learning stages shown are sample content for this fictional demonstration.",
        text051: "BEYOND THE CLASSROOM",
        text052: "The best lessons<br>often happen <em>out there.</em>",
        text053: "Growing up means trying, creating and finding your people. A well-rounded school life makes space for all three.",
        text054: "Explore student life",
        text055: "LEARN BY DOING",
        text056: "A PLACE TO BELONG",
        text057: "A campus that<br><em>sparks possibility.</em>",
        text058: "In this school concept, every corner invites children to think, move, make and connect.",
        text059: "Bright classrooms",
        text060: "Flexible spaces made for focus, conversation and collaboration.",
        text061: "Science & discovery labs",
        text062: "Hands-on questions lead to thoughtful answers.",
        text063: "A library to get lost in",
        text064: "Stories and ideas for every kind of curious mind.",
        text065: "Space to play & move",
        text066: "Teamwork, wellbeing and a little joyful competition.",
        text067: "Arts & expression",
        text068: "A welcoming studio for making, performing and imagining.",
        text069: "A little more green",
        text070: "Outdoor moments that help little minds reset and reconnect.",
        text071: "MAKE IT YOUR OWN",
        text072: "Find your thing.<br><em>Then find your people.</em>",
        text073: "Sample student clubs and activities bring different interests to life—from sport and music to nature, service and making.",
        text074: "Activities shown are illustrative examples, not a confirmed school programme.",
        text075: "Team sports & movement",
        text076: "Music, drama & performance",
        text077: "Art, design & making",
        text078: "Gardening & nature club",
        text079: "Student voice & community",
        text080: "PEOPLE MAKE A SCHOOL",
        text081: "Known by name.<br><em>Encouraged to grow.</em>",
        text082: "Meet four fictional educators imagined for this school demo. Their profiles and roles are illustrative, not real staff listings.",
        text083: "FICTIONAL EDUCATOR",
        text084: "Early Years Lead",
        text085: "Primary Teacher",
        text086: "Science Educator",
        text087: "Arts & Activities",
        text088: "LITTLE MOMENTS, BIG MEMORIES",
        text089: "A glimpse of <em>school life.</em>",
        text090: "A fictional visual story of campus, learning and community. Select a category to explore, or open any image.",
        text091: "All",
        text092: "Campus",
        text093: "Classrooms",
        text094: "Students",
        text095: "Sports",
        text096: "Events",
        text097: "Activities",
        text098: "Gallery images are illustrative royalty-free photographs, not photographs of an actual Majaliwa school.",
        text099: "YOUR NEXT CHAPTER",
        text100: "A warm welcome<br><em>starts here.</em>",
        text101: "Curious about a place for your child to thrive? Start a conversation with our demo admissions team.",
        text102: "Start an enquiry",
        text103: "This is a fictional school demo. Enquiries open your email app and are not sent to a school.",
        text104: "Make an inquiry",
        text105: "Tell us a little about your family and what you are looking for.",
        text106: "Submit an application",
        text107: "In a real school, this step could include sharing an application and relevant details.",
        text108: "School assessment",
        text109: "A fictional example of a conversation to understand a learner's needs and next steps.",
        text110: "CLEAR, CONSIDERED INFORMATION",
        text111: "A thoughtful start<br><em>for every family.</em>",
        text112: "Fees and financial information in this concept are sample content only. We have deliberately not listed prices: a real school should share a current, complete fee schedule directly with families.",
        text113: "Sample information only",
        text114: "For current admissions and fee details, contact the school directly. No actual school or fee schedule is represented here.",
        text115: "Ask about admissions",
        text116: "THE MAJALIWA DIFFERENCE",
        text117: "A little more<br><em>human.</em>",
        text118: "The school we imagine is ambitious about learning and just as serious about how children feel along the way.",
        text119: "Student-focused learning",
        text120: "Learning starts with each student's strengths, questions and next steps.",
        text121: "A safe, supportive environment",
        text122: "A caring community makes room for wellbeing, respect and belonging.",
        text123: "Thoughtful teaching",
        text124: "Engaging teaching encourages strong foundations, questions and discovery.",
        text125: "Technology with purpose",
        text126: "Technology can support creativity, research and practical learning.",
        text127: "WORDS THAT WARM THE HEART",
        text128: "A community<br><em>in the making.</em>",
        text129: "These fictional sample testimonials illustrate the sort of experience a school might share. They are not quotes from real families or learners.",
        text130: "I want my child to feel known, not just counted. That sense of belonging matters as much as the lesson.",
        text131: "Sample parent voice",
        text132: "I love having a chance to try things, make mistakes and figure out how I want to help.",
        text133: "Sample learner voice",
        text134: "A good school invites families in and makes room for honest conversations.",
        text135: "Sample community voice",
        text136: "SAVE A LITTLE SPACE",
        text137: "A calendar full<br><em>of possibility.</em>",
        text138: "Five upcoming sample events, dreamed up for this fictional school demonstration. Dates and activities are illustrative only.",
        text139: "OCT 2026",
        text140: "OPEN DAY · SAMPLE",
        text141: "A first look around",
        text142: "Imagine meeting our community and discovering the spaces.",
        text143: "PARENTS MEETING · SAMPLE",
        text144: "A conversation with families",
        text145: "An imagined opportunity for families and educators to share ideas.",
        text146: "NOV 2026",
        text147: "SPORTS DAY · SAMPLE",
        text148: "Move, play, belong",
        text149: "A joyful day of teamwork, movement and friendly competition.",
        text150: "SCIENCE EXHIBITION · SAMPLE",
        text151: "Questions become discoveries",
        text152: "An imagined showcase of student experiments, ideas and learning.",
        text153: "CULTURAL DAY · SAMPLE",
        text154: "Stories, traditions and community",
        text155: "A fictional celebration of the cultures and creativity in our community.",
        text156: "A FEW GOOD QUESTIONS",
        text157: "Wondering<br><em>about something?</em>",
        text158: "Here are some starting points. This is a fictional school demo; contact details are for demonstration only.",
        text159: "Ask us a question",
        text160: "Is Majaliwa International School a real school?",
        text161: "No. This is a fictional sample website created as a design demonstration. The school, staff, programme and events shown here are not real.",
        text162: "Which ages and school levels are included?",
        text163: "The demo concept shows early years, primary and secondary levels with illustrative age ranges. These are not confirmed admissions offerings.",
        text164: "How much are the school fees?",
        text165: "No actual fees are listed or implied. For a real school, families should request its current fee schedule directly. The contact details on this demo are portfolio sample details.",
        text166: "What does the admissions process look like?",
        text167: "The three steps shown are an illustrative example only. Since the school is fictional, there is no real admissions team, application process or availability.",
        text168: "Can I send a message using this form?",
        text169: "The form prepares an email in your own email app; it does not send information to a website or school backend. You can review and choose whether to send it.",
        text170: "LET'S START A CONVERSATION",
        text171: "Your next<br><em>hello starts here.</em>",
        text172: "Have a question or want to explore the concept? We'd love to hear from you. The contact details are provided for this fictional demo only.",
        text173: "CALL OUR DEMO LINE",
        text174: "EMAIL OUR DEMO INBOX",
        text175: "MESSAGE ON WHATSAPP",
        text176: "Chat with us",
        text177: "Sample contact details for the website demo. Please don't send sensitive or personal information.",
        text178: "FICTIONAL SCHOOL DEMO · EMAIL HANDOFF ONLY",
        text179: "Send a little note",
        text180: "Your information stays in this browser until you choose to open and send the email yourself.",
        text181: "Full Name",
        text182: "Phone Number",
        text183: "Email",
        text184: "Subject",
        text185: "Message",
        text186: "Send Message",
        text187: "No backend · Nothing is sent until you choose to send it from your email app.",
        text188: "A BRIGHTER TOMORROW STARTS WITH A QUESTION",
        text189: "Could this be<br><em>your kind of school?</em>",
        text190: "Let's talk",
        text191: "A fictional school. An idea full of possibility.",
        text192: "Explore",
        text193: "Gallery",
        text194: "Plan ahead",
        text195: "Sample fees",
        text196: "Demo events",
        text197: "FAQs",
        text198: "WhatsApp",
        text199: "Dar es Salaam, Tanzania",
        text200: "Fictional school website demo · All details are illustrative.",
        text201: "Back to top ↑",
        text202: "Home",
        text203: "About School",
        text204: "Academics",
        text205: "Teachers",
        text206: "Gallery",
        text207: "Admissions",
        text208: "Fees",
        text209: "Contact",
        text214: "Integrity",
        text215: "Respect",
        text216: "Excellence",
        text217: "Creativity",
        text218: "Responsibility",
        text219: "Community",
        text220: "She supports confident learners through caring, purposeful classroom practice.",
        text221: "He makes room for questions, experiments and practical problem-solving.",
        text222: "She encourages clear communication and thoughtful exploration of people and ideas.",
        text223: "He helps students use technology with curiosity, creativity and care.",
        text224: "Admission decision",
        text225: "The school would share an update with the family. This demo does not represent a real process.",
        text226: "Early Years",
        text227: "Primary",
        text228: "Secondary",
        text229: "Academic and personal growth",
        text230: "Students are encouraged to grow in knowledge, confidence and character.",
        text231: "Sport and creative activities",
        text232: "A balanced school experience makes space for movement, expression and teamwork.",
        text233: "Strong family communication",
        text234: "Open, respectful parent-school communication helps a learning community thrive.",
        text235: "Need a professional school website?",
        text236: "Majaliwa Yahaya can create a modern website for your school.",
        text237: "Build My School Website",
        text238: "Website concept designed by Majaliwa Yahaya",
        text239: "Chat With Us",
        pageTitle: "Majaliwa International School | Quality Education in Tanzania",
        pageDescription: "Explore Majaliwa International School, a fictional school website demo based in Dar es Salaam, Tanzania.",
        demoTestimonial: "Demo testimonial",
        feesSampleLabel: "SAMPLE FEES — DEMO ONLY",
        validationRequired: "Please complete this field.",
        validationName: "Please enter your full name (at least 2 characters).",
        validationPhone: "Please enter a valid phone number.",
        validationEmail: "Please enter a valid email address.",
        validationSubject: "Please enter a subject.",
        validationMessage: "Please write a message of at least 10 characters.",
        formReady: "Your email is ready. Review it in your email app before choosing whether to send.",
        openEmail: "Open your email app",
        mailtoUnavailable: "Your email app may not be available on this device. You can still email",
        openNavigation: "Open navigation",
        closeNavigation: "Close navigation"
    },
    sw: {
        alt001: "Wanafunzi wakijifunza pamoja katika darasa lenye mwanga",
        alt002: "Mwanafunzi akisoma katika sehemu ya kujifunzia yenye mwanga wa jua",
        alt003: "Watoto wa chekechea wakichunguza pamoja",
        alt004: "Wanafunzi wa msingi wakifanya kazi pamoja darasani",
        alt005: "Wanafunzi vijana wakishirikiana kwenye mradi wa shule",
        alt006: "Wanafunzi wakibadilishana mawazo kwenye shughuli ya kikundi",
        alt007: "Darasa la shule lenye mwanga na ukarimu",
        alt008: "Mwanafunzi akichunguza jaribio la sayansi",
        alt009: "Rafu za vitabu katika maktaba tulivu ya shule",
        alt010: "Watoto wakicheza mchezo wa timu nje",
        alt011: "Vifaa vya sanaa vyenye rangi kwa ajili ya ubunifu wa wanafunzi",
        alt012: "Bustani ya kijani iliyozungukwa na miti",
        alt013: "Picha ya mfano ya Bi Amina Hassan, elimu ya msingi",
        alt014: "Picha ya mfano ya Bw Daniel Joseph, sayansi na hisabati",
        alt015: "Picha ya mfano ya Bi Neema Peter, lugha na masomo ya jamii",
        alt016: "Picha ya mfano ya Bw Samuel John, TEHAMA na teknolojia",
        alt017: "Viwanja vya kijani na jengo la shule lenye ukarimu",
        alt018: "Darasa lenye mwanga na mazingira rafiki ya kujifunzia",
        alt019: "Wanafunzi wakijifunza pamoja darasani",
        alt020: "Vijana wakicheza mchezo wa timu nje",
        alt021: "Wanafunzi wakishiriki kwenye mkusanyiko wa jumuiya ya shule",
        alt022: "Vifaa vya sanaa tayari kwa shughuli ya ubunifu ya wanafunzi",
        label001: "Ukurasa wa mwanzo wa Shule ya Kimataifa ya Majaliwa",
        label002: "Fungua menyu",
        label003: "Menyu kuu",
        label004: "Badili lugha iwe Kiingereza",
        label005: "Sogeza hadi falsafa yetu",
        label006: "Fahamu udahili wa elimu ya awali",
        label007: "Fahamu udahili wa shule ya msingi",
        label008: "Fahamu udahili wa shule ya sekondari",
        label009: "Chuja picha kulingana na kundi",
        label010: "Wasiliana na demo ya Majaliwa kupitia WhatsApp",
        label011: "Kitazamaji cha picha",
        label012: "Funga kitazamaji cha picha",
        label013: "Picha iliyotangulia",
        label014: "Picha inayofuata",
        placeholder001: "mf. Asha Mwakalinga",
        placeholder002: "Namba yako ya simu",
        placeholder003: "wewe@mfano.com",
        placeholder004: "Ungependa kuuliza kuhusu nini?",
        placeholder005: "Andika ujumbe wako hapa…",
        caption001: "Kampasi yenye ukarimu — picha ya mfano ya demo",
        caption002: "Darasa lenye mwanga — picha ya mfano ya demo",
        caption003: "Kujifunza pamoja — picha ya mfano ya demo",
        caption004: "Michezo, mazoezi na ushirikiano — picha ya mfano ya demo",
        caption005: "Mkusanyiko wa jumuiya ya shule — picha ya mfano ya demo",
        caption006: "Shughuli za ubunifu — picha ya mfano ya demo",
        text001: "Ruka hadi kwenye maudhui makuu",
        text002: "DEMO YA TOVUTI YA SHULE YA KUBUNI · Taarifa zote za shule ni za mfano",
        text003: "SHULE YA KIMATAIFA",
        text004: "Kuhusu shule",
        text005: "Mafunzo",
        text006: "Maisha ya shule",
        text007: "Udahili",
        text008: "Mawasiliano",
        text009: "Uliza sasa",
        text010: "MAHALI PA KUKUA",
        text011: "DAR ES SALAAM, TANZANIA",
        text012: "Kuandaa Akili za Vijana<br>kwa <em>Mustakabali Bora</em>",
        text013: "Katika Majaliwa International School, tunajenga mazingira bora ya kujifunza yanayowasaidia wanafunzi kukuza maarifa, kujiamini, ubunifu na tabia njema.",
        text014: "Omba Nafasi",
        text015: "Tembelea Shule Yetu",
        text016: "Wazo la shule ya kubuni lililotengenezwa kwa madhumuni ya maonyesho.",
        text017: "Kujifunza kwa kusudi",
        text018: "FALSAFA YETU",
        text019: "Elimu inapaswa kufungua milango na kuwapa watoto ujasiri wa kuipitia.",
        text020: "Majaliwa, kujifunza ni zaidi ya yanayotokea darasani. Ni ujasiri wa kuuliza maswali, kujali na kusikiliza, pamoja na udadisi wa kuona fursa katika ulimwengu unaotuzunguka.",
        text021: "Hadithi ya shule yetu",
        text022: "Kila mwanafunzi ni sehemu ya jumuiya.",
        text023: "SHULE YENYE MOYO MKUBWA",
        text024: "Imara hapa.<br><em>Tayari kwa dunia.</em>",
        text025: "Shule ya Kimataifa ya Majaliwa ni wazo la shule ya kubuni inayoweka familia katikati, iliyobuniwa kwa ajili ya Dar es Salaam. Jina “Majaliwa” linatukumbusha uwezo alionao kila mtoto na wajibu wa pamoja wa kuukuza.",
        text026: "DIRA YETU",
        text027: "Wanafunzi wenye kujiamini na raia wenye huruma.",
        text028: "Kukuza kizazi kilicho tayari kuchangia kwa ubunifu, uadilifu na mtazamo wa kimataifa.",
        text029: "DHIMA YETU",
        text030: "Kutoa nafasi kwa kila aina ya kipaji.",
        text031: "Kuunda mazingira yenye kujali na kuvutia ambamo misingi imara na ugunduzi wa furaha vinaenda pamoja.",
        text032: "MISINGI YETU",
        text033: "Udadisi",
        text034: "Wema",
        text035: "Ujasiri",
        text036: "Uadilifu",
        text037: "Ushirikiano",
        text038: "MAFUNZO, HATUA KWA HATUA",
        text039: "Mwanzo imara.<br><em>Nafasi ya kung’ara.</em>",
        text040: "Safari za kujifunza huwazingatia watoto walipo na kuwasaidia kugundua wanachoweza kuwa.",
        text041: "UMRI WA MIAKA 3–5 · MFANO",
        text042: "Elimu ya awali",
        text043: "Mwanzo wa kujifunza kwa kucheza unaojenga lugha, kujiamini, urafiki na upendo wa kugundua.",
        text044: "UMRI WA MIAKA 6–11 · MFANO",
        text045: "Shule ya msingi",
        text046: "Msingi mpana wa kusoma, kuandika, hesabu, sayansi na mazoea ya kujifunza kwa kujitegemea.",
        text047: "UMRI WA MIAKA 12–17 · MFANO",
        text048: "Shule ya sekondari",
        text049: "Uchunguzi wa kina, miradi yenye kusudi na msaada wa kuunda njia ya mwanafunzi ya baadaye.",
        text050: "Viwango vya umri na madarasa vilivyoonyeshwa ni maudhui ya mfano kwa demo hii ya kubuni.",
        text051: "ZAIDI YA DARASA",
        text052: "Masomo bora<br>mara nyingi hupatikana <em>nje ya darasa.</em>",
        text053: "Kukua kunamaanisha kujaribu, kubuni na kupata marafiki. Maisha bora ya shule hutoa nafasi kwa yote hayo.",
        text054: "Gundua maisha ya wanafunzi",
        text055: "JIFUNZE KWA KUTENDA",
        text056: "MAHALI PA KUJISIKIA NYUMBANI",
        text057: "Kampasi inayochochea<br><em>uwezo na fursa.</em>",
        text058: "Katika wazo hili la shule, kila sehemu inawaalika watoto kufikiri, kucheza, kubuni na kushirikiana.",
        text059: "Madarasa yenye mwanga",
        text060: "Nafasi zinazoweza kubadilika kwa ajili ya umakini, mazungumzo na ushirikiano.",
        text061: "Maabara za sayansi na ugunduzi",
        text062: "Maswali ya vitendo huongoza kwenye majibu yenye tafakuri.",
        text063: "Maktaba ya kusisimua",
        text064: "Hadithi na mawazo kwa kila akili yenye udadisi.",
        text065: "Nafasi ya kucheza na kufanya mazoezi",
        text066: "Ushirikiano, afya njema na ushindani wa furaha.",
        text067: "Sanaa na kujieleza",
        text068: "Studio rafiki ya kubuni, kuigiza na kuwaza.",
        text069: "Nafasi ya kijani",
        text070: "Muda wa nje unaosaidia watoto kupumzika na kuungana tena.",
        text071: "GUNDUA KIPAJI CHAKO",
        text072: "Gundua kipaji chako.<br><em>Kisha pata wenzako.</em>",
        text073: "Vilabu na shughuli za mfano huendeleza vipaji mbalimbali—kuanzia michezo na muziki hadi mazingira, huduma na ubunifu.",
        text074: "Shughuli zilizoonyeshwa ni mifano tu, si programu rasmi ya shule.",
        text075: "Michezo ya timu na mazoezi",
        text076: "Muziki, maigizo na maonesho",
        text077: "Sanaa, usanifu na ubunifu",
        text078: "Klabu ya bustani na mazingira",
        text079: "Sauti ya wanafunzi na jamii",
        text080: "WATU NDIO HUTENGENEZA SHULE",
        text081: "Kutambulika kwa jina.<br><em>Kutiwa moyo kukua.</em>",
        text082: "Kutana na waalimu wanne wa kubuni walioundwa kwa demo hii. Wasifu na nafasi zao ni mifano, si orodha halisi ya wafanyakazi.",
        text083: "MWALIMU WA KUBUNI",
        text084: "Elimu ya msingi",
        text085: "Sayansi na hisabati",
        text086: "Lugha na masomo ya jamii",
        text087: "TEHAMA na teknolojia",
        text088: "MOMENTI NDOGO, KUMBUKUMBU KUBWA",
        text089: "Mwonekano wa <em>maisha ya shule.</em>",
        text090: "Hadithi ya picha ya kubuni kuhusu kampasi, mafunzo na jamii. Chagua kundi au fungua picha yoyote.",
        text091: "Zote",
        text092: "Kampasi",
        text093: "Madarasa",
        text094: "Wanafunzi",
        text095: "Michezo",
        text096: "Matukio",
        text097: "Shughuli",
        text098: "Picha za hapa ni picha za mfano zisizo na malipo ya leseni, si picha za shule halisi ya Majaliwa.",
        text099: "HATUA YAKO INAYOFUATA",
        text100: "Karibu sana<br><em>uanze hapa.</em>",
        text101: "Unatafuta mahali ambapo mtoto wako atastawi? Anza mazungumzo na timu yetu ya mfano ya udahili.",
        text102: "Anza kuuliza",
        text103: "Hii ni demo ya shule ya kubuni. Ujumbe hufungua programu yako ya barua pepe na hautumiwi shuleni.",
        text104: "Fanya maulizo",
        text105: "Tuambie kidogo kuhusu familia yako na unachotafuta.",
        text106: "Wasilisha ombi la udahili",
        text107: "Katika shule halisi, hatua hii inaweza kuhusisha kuwasilisha fomu ya maombi na taarifa husika.",
        text108: "Tathmini ya mwanafunzi",
        text109: "Huu ni mfano wa mazungumzo ya kuelewa mahitaji ya mwanafunzi na hatua zinazofuata.",
        text110: "TAARIFA WAZI NA ZENYE KUZINGATIWA",
        text111: "Mwanzo mzuri<br><em>kwa kila familia.</em>",
        text112: "Taarifa za ada katika wazo hili ni za mfano tu. Hatukuweka bei: shule halisi inapaswa kushirikisha familia ratiba kamili na ya sasa ya ada.",
        text113: "Taarifa za mfano tu",
        text114: "Kwa taarifa za sasa kuhusu udahili na ada, wasiliana na shule moja kwa moja. Hakuna shule halisi au ratiba ya ada inayowakilishwa hapa.",
        text115: "Uliza kuhusu udahili",
        text116: "TOFAUTI YA MAJALIWA",
        text117: "Kujifunza kwa<br><em>utu zaidi.</em>",
        text118: "Shule tunayoifikiria inalenga mafanikio ya kujifunza na pia kujali hisia za watoto katika safari hiyo.",
        text119: "Kujifunza kwa kuzingatia mwanafunzi",
        text120: "Mafunzo huzingatia uwezo, maswali na hatua zinazofuata kwa kila mwanafunzi.",
        text121: "Mazingira salama na yenye msaada",
        text122: "Jumuiya inayojali huthamini ustawi, heshima na ushirikiano.",
        text123: "Ufundishaji makini",
        text124: "Ufundishaji unaovutia hujenga misingi imara, udadisi na ugunduzi.",
        text125: "Teknolojia yenye manufaa",
        text126: "Teknolojia inaweza kuchochea ubunifu, utafiti na mafunzo ya vitendo.",
        text127: "MANENO YENYE KUGUSA MOYO",
        text128: "Jumuiya<br><em>inayojengwa.</em>",
        text129: "Ushuhuda huu wa kubuni unaonyesha aina ya uzoefu ambao shule inaweza kushirikisha. Si maneno ya familia au wanafunzi halisi.",
        text130: "Nataka mtoto wangu ajulikane, si kuhesabiwa tu. Kujisikia kuwa sehemu ya jumuiya ni muhimu kama somo lenyewe.",
        text131: "Maoni ya mfano ya mzazi",
        text132: "Napenda kupata nafasi ya kujaribu, kufanya makosa na kugundua jinsi ninavyotaka kusaidia.",
        text133: "Maoni ya mfano ya mwanafunzi",
        text134: "Shule nzuri huzikaribisha familia na kutoa nafasi kwa mazungumzo ya wazi.",
        text135: "Maoni ya mfano ya jamii",
        text136: "TENGA MUDA KIDOGO",
        text137: "Kalenda yenye<br><em>fursa nyingi.</em>",
        text138: "Matukio matano yajayo ya mfano, yaliyobuniwa kwa demo hii ya shule ya kubuni. Tarehe na shughuli ni za maonyesho tu.",
        text139: "OKT 2026",
        text140: "SIKU YA WAZI · MFANO",
        text141: "Ziara ya kwanza",
        text142: "Fikiria kukutana na jumuiya yetu na kugundua maeneo ya shule.",
        text143: "MKUTANO WA WAZAZI · MFANO",
        text144: "Mazungumzo na familia",
        text145: "Fursa ya mfano kwa familia na walimu kubadilishana mawazo.",
        text146: "NOV 2026",
        text147: "SIKU YA MICHEZO · MFANO",
        text148: "Cheza, sogea, shiriki",
        text149: "Siku ya furaha ya ushirikiano, mazoezi na ushindani wa kirafiki.",
        text150: "ONESHO LA SAYANSI · MFANO",
        text151: "Maswali yanakuwa ugunduzi",
        text152: "Onyesho la mfano la majaribio, mawazo na mafunzo ya wanafunzi.",
        text153: "SIKU YA TAMADUNI · MFANO",
        text154: "Hadithi, tamaduni na jumuiya",
        text155: "Sherehe ya kubuni inayotambua tamaduni na ubunifu katika jumuiya yetu.",
        text156: "MASWALI MACHACHE MUHIMU",
        text157: "Una swali<br><em>unalotaka kuuliza?</em>",
        text158: "Haya ni majibu ya kuanzia. Hii ni demo ya shule ya kubuni; mawasiliano ni ya maonyesho tu.",
        text159: "Tuulize swali",
        text160: "Je, Shule ya Kimataifa ya Majaliwa ni shule halisi?",
        text161: "Hapana. Hii ni tovuti ya mfano ya kubuni iliyotengenezwa kuonyesha usanifu. Shule, wafanyakazi, programu na matukio yanayoonyeshwa hapa si halisi.",
        text162: "Shule inahusisha umri na viwango gani?",
        text163: "Wazo la demo linaonyesha elimu ya awali, msingi na sekondari pamoja na viwango vya umri vya mfano. Huu si uthibitisho wa nafasi za udahili.",
        text164: "Ada za shule ni kiasi gani?",
        text165: "Hakuna ada halisi zilizoorodheshwa au kudokezwa. Kwa shule halisi, familia zinapaswa kuomba ratiba ya sasa ya ada moja kwa moja. Mawasiliano kwenye demo hii ni ya mfano wa tovuti tu.",
        text166: "Mchakato wa udahili ukoje?",
        text167: "Hatua tatu zilizoonyeshwa ni mfano tu. Kwa kuwa shule ni ya kubuni, hakuna timu halisi ya udahili, mchakato wa maombi au nafasi.",
        text168: "Je, ninaweza kutuma ujumbe kwa fomu hii?",
        text169: "Fomu huandaa barua pepe katika programu yako; haitumi taarifa kwenye tovuti au mfumo wa shule. Unaweza kuikagua na kuamua kama utaituma.",
        text170: "TUANZE MAZUNGUMZO",
        text171: "Salamu yako<br><em>inaanzia hapa.</em>",
        text172: "Una swali au ungependa kufahamu zaidi kuhusu wazo hili? Tungependa kusikia kutoka kwako. Mawasiliano haya ni ya demo hii ya kubuni tu.",
        text173: "PIGA SIMU KWENYE NAMBA YA MFANO",
        text174: "TUMA BARUA KWENYE BARUA PEPE YA MFANO",
        text175: "TUMA UJUMBE WHATSAPP",
        text176: "Piga gumzo nasi",
        text177: "Mawasiliano ya mfano kwa demo ya tovuti. Tafadhali usitume taarifa nyeti au za kibinafsi.",
        text178: "DEMO YA SHULE YA KUBUNI · BARUA PEPE PEKEE",
        text179: "Tuma ujumbe mfupi",
        text180: "Taarifa zako hubaki kwenye kivinjari hiki hadi uchague kufungua na kutuma barua pepe mwenyewe.",
        text181: "Jina kamili",
        text182: "Namba ya simu",
        text183: "Barua pepe",
        text184: "Mada",
        text185: "Ujumbe",
        text186: "Tuma Ujumbe",
        text187: "Hakuna mfumo wa nyuma · Hakuna kinachotumwa hadi uchague kutuma kupitia programu yako ya barua pepe.",
        text188: "KESHO NJEMA HUANZA NA SWALI",
        text189: "Je, hii inaweza kuwa<br><em>shule unayoitafuta?</em>",
        text190: "Tuzungumze",
        text191: "Shule ya kubuni. Wazo lenye fursa nyingi.",
        text192: "Gundua",
        text193: "Picha",
        text194: "Panga mapema",
        text195: "Ada za mfano",
        text196: "Matukio ya mfano",
        text197: "Maswali ya mara kwa mara",
        text198: "WhatsApp",
        text199: "Dar es Salaam, Tanzania",
        text200: "Demo ya tovuti ya shule ya kubuni · Taarifa zote ni za mfano.",
        text201: "Rudi juu ↑",
        text202: "Mwanzo",
        text203: "Kuhusu Shule",
        text204: "Masomo",
        text205: "Walimu",
        text206: "Picha",
        text207: "Udahili",
        text208: "Ada",
        text209: "Mawasiliano",
        text214: "Uadilifu",
        text215: "Heshima",
        text216: "Ubora",
        text217: "Ubunifu",
        text218: "Uwajibikaji",
        text219: "Jumuiya",
        text220: "Huwasaidia wanafunzi kujiamini kupitia ufundishaji wenye kujali na malengo wazi.",
        text221: "Hutoa nafasi kwa maswali, majaribio na utatuzi wa changamoto za vitendo.",
        text222: "Huhamasisha mawasiliano mazuri na kuchunguza watu pamoja na mawazo kwa makini.",
        text223: "Huwaongoza wanafunzi kutumia teknolojia kwa udadisi, ubunifu na uwajibikaji.",
        text224: "Uamuzi wa udahili",
        text225: "Shule ingetoa taarifa kwa familia. Hatua hii ni ya mfano tu, si utaratibu halisi.",
        text226: "Elimu ya awali",
        text227: "Elimu ya msingi",
        text228: "Elimu ya sekondari",
        text229: "Ukuaji wa kitaaluma na binafsi",
        text230: "Wanafunzi huhamasishwa kukuza maarifa, kujiamini na tabia njema.",
        text231: "Michezo na shughuli za ubunifu",
        text232: "Maisha bora ya shule hutoa nafasi kwa mazoezi, kujieleza na ushirikiano.",
        text233: "Mawasiliano imara na familia",
        text234: "Mawasiliano ya wazi na yenye heshima kati ya wazazi na shule huimarisha jumuiya ya kujifunza.",
        text235: "Unahitaji tovuti bora ya shule?",
        text236: "Majaliwa Yahaya anaweza kutengeneza tovuti ya kisasa kwa ajili ya shule yako.",
        text237: "Tengeneza Tovuti ya Shule Yangu",
        text238: "Wazo la tovuti limebuniwa na Majaliwa Yahaya",
        text239: "Ongea Nasi",
        pageTitle: "Shule ya Kimataifa ya Majaliwa | Elimu Bora Tanzania",
        pageDescription: "Fahamu Shule ya Kimataifa ya Majaliwa, demo ya tovuti ya shule ya kubuni iliyopo Dar es Salaam, Tanzania.",
        demoTestimonial: "Ushuhuda wa mfano",
        feesSampleLabel: "ADA ZA MFANO — SI ADA HALISI",
        validationRequired: "Tafadhali jaza sehemu hii.",
        validationName: "Tafadhali weka jina lako kamili (angalau herufi 2).",
        validationPhone: "Tafadhali weka namba sahihi ya simu.",
        validationEmail: "Tafadhali weka anwani sahihi ya barua pepe.",
        validationSubject: "Tafadhali weka mada.",
        validationMessage: "Tafadhali andika ujumbe wenye angalau herufi 10.",
        formReady: "Barua pepe yako iko tayari. Ikague kwenye programu yako kabla ya kuamua kuituma.",
        openEmail: "Fungua programu ya barua pepe",
        mailtoUnavailable: "Huenda programu ya barua pepe haipatikani kwenye kifaa hiki. Bado unaweza kutuma barua pepe kwa",
        openNavigation: "Fungua menyu",
        closeNavigation: "Funga menyu"
    }
};
  const page = document.documentElement;
  const languageButton = document.querySelector(".language-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  let currentLanguage = localStorage.getItem(STORAGE_KEY) === "sw" ? "sw" : "en";
  let lastGalleryTrigger = null;
  let currentGalleryItems = [];
  let currentGalleryIndex = 0;

  function updateLanguage(language, persist = true) {
    currentLanguage = language === "sw" ? "sw" : "en";
    page.lang = currentLanguage;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = translations[currentLanguage][element.dataset.i18n];
      if (value !== undefined) element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      element.dataset.i18nAttr.split(/\s+/).forEach((mapping) => {
        const [attribute, key] = mapping.split(":");
        if (attribute && key && translations[currentLanguage][key] !== undefined) {
          element.setAttribute(attribute, translations[currentLanguage][key]);
        }
      });
    });
    document.title = translations[currentLanguage].pageTitle;
    document.querySelector('meta[name="description"]').content = translations[currentLanguage].pageDescription;
    document.querySelector('meta[property="og:title"]').content = translations[currentLanguage].pageTitle;
    document.querySelector('meta[property="og:description"]').content = translations[currentLanguage].pageDescription;
    languageButton.setAttribute("aria-pressed", String(currentLanguage === "sw"));
    languageButton.setAttribute("aria-label", currentLanguage === "en" ? "Switch language to Kiswahili" : "Badili lugha iwe Kiingereza");
    if (menuToggle) menuToggle.setAttribute("aria-label", translations[currentLanguage][navigationIsOpen() ? "closeNavigation" : "openNavigation"]);
    if (persist) localStorage.setItem(STORAGE_KEY, currentLanguage);
    clearFormErrors();
  }

  function navigationIsOpen() {
    return Boolean(navigation?.classList.contains("is-open"));
  }

  function setMenuOpen(open) {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", translations[currentLanguage][open ? "closeNavigation" : "openNavigation"]);
    navigation.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open && window.matchMedia("(max-width: 820px)").matches);
    if (!open) menuToggle.focus();
  }

  languageButton.addEventListener("click", () => updateLanguage(currentLanguage === "en" ? "sw" : "en"));
  if (menuToggle) {
    menuToggle.addEventListener("click", () => setMenuOpen(!navigationIsOpen()));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      if (navigationIsOpen()) setMenuOpen(false);
    }));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigationIsOpen()) setMenuOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 821px)").matches && navigationIsOpen()) {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
  }

  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      galleryItems.forEach((item) => { item.hidden = category !== "all" && item.dataset.category !== category; });
    });
  });

  const lightbox = document.querySelector("#gallery-lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector("figcaption");
  function showGalleryItem(index) {
    if (!currentGalleryItems.length || !lightboxImage || !lightboxCaption) return;
    currentGalleryIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    const item = currentGalleryItems[currentGalleryIndex];
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.dataset.caption;
  }
  galleryItems.forEach((item) => item.addEventListener("click", () => {
    currentGalleryItems = galleryItems.filter((candidate) => !candidate.hidden);
    currentGalleryIndex = currentGalleryItems.indexOf(item);
    lastGalleryTrigger = item;
    showGalleryItem(currentGalleryIndex);
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
    lightbox.querySelector(".lightbox-close").focus();
  }));
  lightbox?.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox?.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryItem(currentGalleryIndex - 1));
  lightbox?.querySelector(".lightbox-next").addEventListener("click", () => showGalleryItem(currentGalleryIndex + 1));
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener("close", () => lastGalleryTrigger?.focus());
  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showGalleryItem(currentGalleryIndex - 1);
    if (event.key === "ArrowRight") showGalleryItem(currentGalleryIndex + 1);
  });

  const fieldDefinitions = [
    { id: "full-name", errorId: "name-error", message: "validationName" },
    { id: "phone", errorId: "phone-error", message: "validationPhone" },
    { id: "email", errorId: "email-error", message: "validationEmail" },
    { id: "subject", errorId: "subject-error", message: "validationSubject" },
    { id: "message", errorId: "message-error", message: "validationMessage" }
  ];
  const fields = fieldDefinitions.map((definition) => ({
    ...definition, input: document.getElementById(definition.id), error: document.getElementById(definition.errorId)
  }));
  function fieldMessage(field) {
    const input = field.input;
    if (!input.value.trim()) return translations[currentLanguage].validationRequired;
    if (field.message === "validationName" && input.value.trim().length < 2) return translations[currentLanguage].validationName;
    if (field.message === "validationPhone" && !/^\+?[\d\s().-]{7,20}$/.test(input.value.trim())) return translations[currentLanguage].validationPhone;
    if (field.message === "validationEmail" && (input.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()))) return translations[currentLanguage].validationEmail;
    if (field.message === "validationMessage" && input.value.trim().length < 10) return translations[currentLanguage].validationMessage;
    return "";
  }
  function validateField(field) {
    const message = fieldMessage(field);
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    field.input.setCustomValidity(message);
    return !message;
  }
  function clearFormErrors() {
    fields.forEach((field) => {
      field.error.textContent = "";
      field.input.removeAttribute("aria-invalid");
      field.input.setCustomValidity("");
    });
    formStatus.hidden = true;
    formStatus.replaceChildren();
  }
  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.hasAttribute("aria-invalid")) validateField(field);
      if (!formStatus.hidden) { formStatus.hidden = true; formStatus.replaceChildren(); }
    });
  });
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!fields.map(validateField).every(Boolean)) {
      fields.find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
      return;
    }
    const values = Object.fromEntries(new FormData(contactForm).entries());
    const nameLabel = currentLanguage === "en" ? "Name" : "Jina";
    const phoneLabel = currentLanguage === "en" ? "Phone" : "Simu";
    const emailLabel = currentLanguage === "en" ? "Email" : "Barua pepe";
    const body = `${nameLabel}: ${values.name}\n${phoneLabel}: ${values.phone}\n${emailLabel}: ${values.email}\n\n${values.message}`;
    const mailto = `mailto:majaliway2@gmail.com?subject=${encodeURIComponent(String(values.subject))}&body=${encodeURIComponent(body)}`;
    formStatus.replaceChildren(document.createTextNode(`${translations[currentLanguage].formReady} `));
    const emailLink = document.createElement("a");
    emailLink.href = mailto;
    emailLink.textContent = translations[currentLanguage].openEmail;
    formStatus.append(emailLink, document.createElement("br"), document.createTextNode(`${translations[currentLanguage].mailtoUnavailable} `));
    const address = document.createElement("a");
    address.href = "mailto:majaliway2@gmail.com";
    address.textContent = "majaliway2@gmail.com";
    formStatus.append(address);
    formStatus.hidden = false;
    formStatus.focus();
  });
  updateLanguage(currentLanguage, false);
})();
