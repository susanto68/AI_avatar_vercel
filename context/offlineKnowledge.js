import { AVATAR_CONFIG } from './constant.js'

// Comprehensive offline knowledge base for all avatars
export const OFFLINE_KNOWLEDGE_BASE = {
  'biology-teacher': {
    'brain': {
      title: "The Human Brain",
      content: `The brain is the command center of the human body, controlling all our thoughts, movements, and bodily functions. It's made up of billions of nerve cells called neurons that communicate through electrical and chemical signals.

**Key Facts:**
• Weight: About 3 pounds (1.4 kg)
• Neurons: Approximately 86 billion
• Energy Usage: 20% of body's total energy
• Functions: Memory, learning, emotions, behavior control

**Main Parts:**
1. **Cerebrum** - Thinking, voluntary actions, memory
2. **Cerebellum** - Balance, coordination, fine motor skills
3. **Brainstem** - Basic life functions (breathing, heart rate)

**Interesting Facts:**
• The brain can process information at 268 mph
• It generates enough electricity to power a light bulb
• New neural connections form when you learn something new`,
      keywords: ['brain', 'nervous system', 'neurons', 'cerebrum', 'cerebellum', 'brainstem']
    },
    'cell': {
      title: "Cells: Building Blocks of Life",
      content: `Cells are the basic building blocks of all living things. They are microscopic structures that carry out all the functions necessary for life.

**What are Cells?**
• The smallest unit of life
• All living organisms are made of cells
• Human body contains trillions of cells
• Each cell has a specific function

**Cell Structure:**
1. **Cell Membrane** - Protects and controls what enters/exits
2. **Nucleus** - Contains genetic material (DNA)
3. **Cytoplasm** - Gel-like substance where reactions occur
4. **Organelles** - Specialized structures for specific tasks

**Types of Cells:**
• **Nerve cells** - Transmit electrical signals
• **Muscle cells** - Enable movement
• **Blood cells** - Transport oxygen and nutrients
• **Skin cells** - Provide protection`,
      keywords: ['cell', 'cells', 'nucleus', 'membrane', 'cytoplasm', 'organelles']
    },
    'heart': {
      title: "The Human Heart",
      content: `The heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to all cells.

**Heart Facts:**
• Size: About the size of your fist
• Weight: 8-10 ounces (250-300 grams)
• Beats: 60-100 times per minute at rest
• Daily beats: Over 100,000 times

**Heart Structure:**
1. **Four Chambers:**
   - Right atrium and ventricle
   - Left atrium and ventricle
2. **Valves** - Prevent blood from flowing backward
3. **Muscle tissue** - Contracts to pump blood

**Blood Flow:**
• Deoxygenated blood → Right side → Lungs
• Oxygenated blood → Left side → Body`,
      keywords: ['heart', 'blood', 'circulation', 'pump', 'chambers', 'valves']
    },
    'default': {
      title: "Biology Fundamentals",
      content: `Biology is the study of living organisms and their interactions with each other and their environment. It covers everything from tiny cells to complex ecosystems.

**Key Areas in Biology:**
1. **Cell Biology** - Studying the basic units of life
2. **Genetics** - Understanding how traits are inherited
3. **Ecology** - Examining how organisms interact with their environment
4. **Evolution** - Studying how species change over time
5. **Human Anatomy** - Understanding the human body structure

**Why Study Biology?**
• Understand how your body works
• Learn about diseases and treatments
• Appreciate the diversity of life
• Make informed health decisions
• Contribute to scientific discoveries`,
      keywords: ['biology', 'life', 'organisms', 'cells', 'genetics', 'ecology']
    }
  },
  'physics-teacher': {
    'motion': {
      title: "Motion and Forces",
      content: `Motion is the change in position of an object over time. It's one of the fundamental concepts in physics that helps us understand how things move.

**Types of Motion:**
1. **Linear Motion** - Moving in a straight line
2. **Circular Motion** - Moving in a circle
3. **Oscillatory Motion** - Back and forth movement
4. **Random Motion** - Unpredictable movement

**Key Concepts:**
• **Speed** - How fast something moves (distance/time)
• **Velocity** - Speed with direction
• **Acceleration** - How quickly velocity changes
• **Force** - What causes motion to change

**Newton's Laws of Motion:**
1. **First Law** - Objects stay at rest or in motion unless acted upon by a force
2. **Second Law** - Force = mass × acceleration
3. **Third Law** - For every action, there's an equal and opposite reaction`,
      keywords: ['motion', 'movement', 'speed', 'velocity', 'acceleration', 'force', 'newton']
    },
    'energy': {
      title: "Forms of Energy",
      content: `Energy is the ability to do work or cause change. It's a fundamental concept in physics that comes in many forms.

**Types of Energy:**
1. **Kinetic Energy** - Energy of motion
   • Moving car, falling ball, flowing water
2. **Potential Energy** - Stored energy
   • Stretched rubber band, raised object, compressed spring
3. **Thermal Energy** - Heat energy
   • Hot coffee, warm air, steam
4. **Electrical Energy** - Energy from electric charges
   • Lightning, batteries, power lines
5. **Chemical Energy** - Energy stored in chemical bonds
   • Food, gasoline, explosives

**Energy Conservation:**
• Energy cannot be created or destroyed
• It only changes from one form to another
• Total energy in a system remains constant`,
      keywords: ['energy', 'kinetic', 'potential', 'thermal', 'electrical', 'chemical']
    },
    'light': {
      title: "Light and Optics",
      content: `Light is a form of electromagnetic radiation that we can see. It travels in straight lines and can be reflected, refracted, and absorbed.

**Properties of Light:**
• **Speed** - 186,000 miles per second (300,000 km/s)
• **Wavelength** - Determines color
• **Intensity** - Determines brightness

**Light Behavior:**
1. **Reflection** - Light bounces off surfaces
2. **Refraction** - Light bends when passing through different materials
3. **Absorption** - Light is absorbed by materials
4. **Diffraction** - Light bends around obstacles

**Colors of Light:**
• White light contains all colors
• Primary colors: Red, Blue, Green
• Mixing colors creates new colors`,
      keywords: ['light', 'optics', 'reflection', 'refraction', 'color', 'wavelength']
    },
    'default': {
      title: "Physics Fundamentals",
      content: `Physics is the study of matter, energy, and their interactions. It helps us understand how the universe works at both the smallest and largest scales.

**Main Branches of Physics:**
1. **Mechanics** - Motion, forces, and energy
2. **Thermodynamics** - Heat and energy transfer
3. **Electromagnetism** - Electricity and magnetism
4. **Optics** - Light and vision
5. **Quantum Physics** - Behavior of very small particles

**Why Study Physics?**
• Understand how the world works
• Develop problem-solving skills
• Apply to engineering and technology
• Explore the mysteries of the universe
• Make scientific discoveries`,
      keywords: ['physics', 'matter', 'energy', 'forces', 'motion', 'universe']
    }
  },
  'chemistry-teacher': {
    'acid': {
      title: "Acids and Bases",
      content: `Acids and bases are important chemical compounds that have opposite properties and are found everywhere in our daily lives.

**What are Acids?**
• Substances that release hydrogen ions (H+) in water
• Taste sour (like lemon juice)
• Turn blue litmus paper red
• Conduct electricity when dissolved in water

**What are Bases?**
• Substances that release hydroxide ions (OH-) in water
• Taste bitter and feel slippery
• Turn red litmus paper blue
• Also conduct electricity when dissolved

**Common Examples:**
• **Acids:** Lemon juice, vinegar, stomach acid, battery acid
• **Bases:** Soap, baking soda, ammonia, drain cleaner

**pH Scale:**
• 0-6: Acidic
• 7: Neutral (water)
• 8-14: Basic`,
      keywords: ['acid', 'acids', 'base', 'bases', 'ph', 'hydrogen', 'hydroxide']
    },
    'reaction': {
      title: "Chemical Reactions",
      content: `A chemical reaction is a process where substances (reactants) transform into new substances (products). It involves breaking and forming chemical bonds.

**Types of Chemical Reactions:**
1. **Synthesis** - Two or more substances combine
2. **Decomposition** - One substance breaks down into simpler substances
3. **Single Replacement** - One element replaces another
4. **Double Replacement** - Two elements switch places
5. **Combustion** - Substance reacts with oxygen, producing heat and light

**Signs of a Chemical Reaction:**
• Color change
• Gas production (bubbles)
• Temperature change
• Formation of a solid (precipitate)
• Odor change

**Examples:**
• Rusting of iron
• Burning of wood
• Baking a cake
• Photosynthesis`,
      keywords: ['reaction', 'chemical', 'reactants', 'products', 'bonds', 'synthesis']
    },
    'element': {
      title: "Chemical Elements",
      content: `Elements are pure substances made of only one type of atom. They are the building blocks of all matter in the universe.

**Element Facts:**
• There are 118 known elements
• Elements are organized in the periodic table
• Each element has unique properties
• Elements can combine to form compounds
• Some elements are naturally occurring, others are synthetic

**Types of Elements:**
1. **Metals** - Good conductors of heat and electricity
2. **Nonmetals** - Poor conductors, often gases
3. **Metalloids** - Properties between metals and nonmetals

**Common Elements:**
• **Hydrogen (H)** - Most abundant element in universe
• **Carbon (C)** - Basis of all life
• **Oxygen (O)** - Essential for breathing
• **Iron (Fe)** - Important for blood and tools`,
      keywords: ['element', 'elements', 'atom', 'atoms', 'periodic table', 'metal']
    },
    'default': {
      title: "Chemistry Basics",
      content: `Chemistry is the study of matter, its properties, and the changes it undergoes. It's often called the "central science" because it connects physics and biology.

**Key Areas in Chemistry:**
1. **Atomic Structure** - Understanding atoms and molecules
2. **Chemical Bonding** - How atoms connect to form compounds
3. **Reactions** - How substances change into new substances
4. **Solutions** - Mixtures and concentrations
5. **Organic Chemistry** - Carbon-based compounds

**Why Study Chemistry?**
• Understand the composition of materials
• Learn about medicines and drugs
• Develop new materials and technologies
• Solve environmental problems
• Make informed decisions about products`,
      keywords: ['chemistry', 'matter', 'atoms', 'molecules', 'compounds', 'reactions']
    }
  }
}

export const fallbackResponses = {
  'computer-teacher': {
    'data structure': `Data structures are ways of organizing data in a computer so that we can use it efficiently.

In simple words, a data structure helps a program store, search, update, and arrange data properly. For example, if we keep student marks in a list, we can easily find, sort, or change the marks.

Common data structures include:
• Array - stores items in order
• Stack - follows Last In, First Out
• Queue - follows First In, First Out
• Linked List - stores data using connected nodes
• Tree - stores data in a hierarchy
• Graph - stores connected objects

Choosing the right data structure makes a program faster, cleaner, and easier to understand.

You're doing a great job - keep practicing and stay curious!`,
    'data structures': `Data structures are ways of organizing data in a computer so that we can use it efficiently.

In simple words, a data structure helps a program store, search, update, and arrange data properly. For example, if we keep student marks in a list, we can easily find, sort, or change the marks.

Common data structures include:
• Array - stores items in order
• Stack - follows Last In, First Out
• Queue - follows First In, First Out
• Linked List - stores data using connected nodes
• Tree - stores data in a hierarchy
• Graph - stores connected objects

Choosing the right data structure makes a program faster, cleaner, and easier to understand.

You're doing a great job - keep practicing and stay curious!`,
    'computer': `A computer is an electronic machine that accepts data, processes it according to instructions, stores information, and gives useful output.

In simple words, a computer helps us do work quickly and accurately. We use it for typing, drawing, calculations, learning, online classes, programming, games, videos, and communication.

The main parts of a computer are input devices, the CPU, memory, storage, and output devices. The CPU is called the brain of the computer because it processes instructions.

You're doing a great job - keep practicing and stay curious!`,
    'javascript': `JavaScript is a programming language used to make websites interactive. HTML gives a page structure, CSS gives it style, and JavaScript adds behavior.

Key JavaScript ideas include:
• Variables - store values like names, numbers, and settings
• Functions - reusable blocks of code
• Events - actions like clicks, typing, or page loading
• DOM manipulation - changing page content with code
• APIs - sending and receiving data from servers

Example:
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Student"));
\`\`\`

JavaScript is used in frontend apps with React and Next.js, backend servers with Node.js, mobile apps, browser extensions, and many automation tools.`,
    'html': `HTML stands for HyperText Markup Language. It gives a web page its structure by describing headings, paragraphs, links, images, forms, and other content.

Key HTML concepts include:
• Elements - building blocks like headings, buttons, and inputs
• Tags - markup such as <h1>, <p>, and <button>
• Attributes - extra information like href, src, class, and id
• Semantic HTML - meaningful tags that improve accessibility and SEO

Example:
\`\`\`html
<h1>My Page</h1>
<p>Welcome to my website.</p>
<button>Click me</button>
\`\`\``,
    'css': `CSS stands for Cascading Style Sheets. It controls how a web page looks, including colors, spacing, fonts, layout, and responsive design.

Key CSS concepts include:
• Selectors - choose which elements to style
• Properties - define styles like color, margin, and display
• Flexbox and Grid - create layouts
• Media queries - adapt designs for mobile and desktop
• Animations - add motion and transitions

Example:
\`\`\`css
button {
  background: blue;
  color: white;
  padding: 12px 16px;
}
\`\`\``,
    'react': `React is a JavaScript library for building user interfaces. It lets developers create reusable components and update the screen efficiently when data changes.

Key React concepts include:
• Components - reusable UI pieces
• Props - data passed into components
• State - data that changes over time
• Hooks - functions like useState and useEffect
• JSX - HTML-like syntax inside JavaScript

Example:
\`\`\`javascript
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\``,
    'default': `Computer science is the study of computers, software, data, and problem-solving. It teaches you how to write programs, build applications, understand algorithms, and create technology.

Key areas in computer science include:
• Programming - writing instructions for computers
• Web development - building websites and apps
• Data structures - organizing information efficiently
• Algorithms - step-by-step problem solving
• Databases - storing and retrieving data
• AI and automation - making systems smarter

You can ask me about JavaScript, HTML, CSS, React, Next.js, Python, Java, algorithms, debugging, or how to build a project.`
  },
  'biology-teacher': {
    'brain': `The brain is the command center of the human body, controlling all our thoughts, movements, and bodily functions. It's made up of billions of nerve cells called neurons that communicate through electrical and chemical signals.

Key facts about the brain:
• It weighs about 3 pounds (1.4 kg)
• Contains approximately 86 billion neurons
• Uses 20% of the body's total energy
• Controls memory, learning, emotions, and behavior
• Protected by the skull and cerebrospinal fluid

The brain has three main parts: the cerebrum (thinking and voluntary actions), cerebellum (balance and coordination), and brainstem (basic life functions like breathing and heart rate).`,
    'cell': `Cells are the basic building blocks of all living things. They are microscopic structures that carry out all the functions necessary for life.

Key facts about cells:
• All living organisms are made of cells
• Human body contains trillions of cells
• Cells have different shapes and sizes for different functions
• Each cell contains organelles that perform specific tasks
• Cells can reproduce and repair themselves`,
    'default': `Biology is the study of living organisms and their interactions with each other and their environment. It covers everything from tiny cells to complex ecosystems.

Key areas in biology include:
• Cell biology - studying the basic units of life
• Genetics - understanding how traits are inherited
• Ecology - examining how organisms interact with their environment
• Evolution - studying how species change over time
• Human anatomy - understanding the human body structure`
  },
  'physics-teacher': {
    'motion': `Motion is the change in position of an object over time. It's one of the fundamental concepts in physics that helps us understand how things move.

Key concepts in motion:
• Speed - how fast something moves
• Velocity - speed with direction
• Acceleration - how quickly velocity changes
• Force - what causes motion to change
• Newton's Laws - the rules that govern motion`,
    'energy': `Energy is the ability to do work or cause change. It's a fundamental concept in physics that comes in many forms.

Types of energy include:
• Kinetic energy - energy of motion
• Potential energy - stored energy
• Thermal energy - heat energy
• Electrical energy - energy from electric charges
• Chemical energy - energy stored in chemical bonds`,
    'default': `Physics is the study of matter, energy, and their interactions. It helps us understand how the universe works at both the smallest and largest scales.

Key areas in physics include:
• Mechanics - motion and forces
• Thermodynamics - heat and energy
• Electromagnetism - electricity and magnetism
• Optics - light and vision
• Quantum physics - behavior of very small particles`
  },
  'chemistry-teacher': {
    'reaction': `A chemical reaction is a process where substances (reactants) transform into new substances (products). It involves breaking and forming chemical bonds.

Key concepts in chemical reactions:
• Reactants - starting materials
• Products - ending materials
• Chemical equations - balanced formulas
• Energy changes - exothermic vs endothermic
• Catalysts - substances that speed up reactions`,
    'element': `Elements are pure substances made of only one type of atom. They are the building blocks of all matter in the universe.

Key facts about elements:
• There are 118 known elements
• Elements are organized in the periodic table
• Each element has unique properties
• Elements can combine to form compounds
• Some elements are naturally occurring, others are synthetic`,
    'default': `Chemistry is the study of matter, its properties, and the changes it undergoes. It's often called the "central science" because it connects physics and biology.

Key areas in chemistry include:
• Atomic structure - understanding atoms and molecules
• Chemical bonding - how atoms connect
• Reactions - how substances change
• Solutions - mixtures and concentrations
• Organic chemistry - carbon-based compounds`
  },
  'mathematics-teacher': {
    'algebra': `Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.

Key concepts in algebra:
• Variables - letters that represent unknown values
• Equations - mathematical statements with equals signs
• Solving - finding the value of variables
• Functions - relationships between variables
• Polynomials - expressions with multiple terms`,
    'geometry': `Geometry is the study of shapes, sizes, positions, and dimensions of objects. It helps us understand the world around us.

Key concepts in geometry:
• Points, lines, and planes
• Angles and measurements
• Triangles, circles, and polygons
• Area and perimeter
• Volume and surface area`,
    'default': `Mathematics is the study of numbers, quantities, shapes, and patterns. It's a fundamental tool used in science, engineering, and everyday life.

Key areas in mathematics include:
• Arithmetic - basic operations with numbers
• Algebra - using letters and symbols
• Geometry - studying shapes and space
• Calculus - rates of change and accumulation
• Statistics - collecting and analyzing data`
  },
  'english-teacher': {
    'grammar': `Grammar is the set of rules that govern how words are used to form sentences. It helps us communicate clearly and effectively.

Key grammar concepts include:
• Parts of speech (nouns, verbs, adjectives)
• Sentence structure and punctuation
• Subject-verb agreement
• Tenses and verb forms
• Proper word usage`,
    'writing': `Writing is the process of creating text to communicate ideas, stories, or information. Good writing is clear, organized, and engaging.

Key writing skills include:
• Planning and organization
• Clear and concise language
• Proper grammar and punctuation
• Engaging introductions and conclusions
• Revising and editing`,
    'default': `English is a rich and complex language used for communication, literature, and learning. It has evolved over centuries and is now one of the most widely spoken languages.

Key areas in English include:
• Grammar - rules for using words correctly
• Vocabulary - building word knowledge
• Reading comprehension - understanding written text
• Writing - expressing ideas clearly
• Literature - appreciating written works`
  }
}

const generateProgrammingFallback = (prompt) => {
  const promptLower = prompt.toLowerCase()

  if (promptLower.includes('magic number') && promptLower.includes('java')) {
    return `You asked for a Java program to check whether a number is a magic number.

A magic number is usually checked by repeatedly adding the digits until a single digit remains. If the final single digit is 1, it is a magic number.

\`\`\`java
import java.util.Scanner;

public class MagicNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        int temp = num;

        while (temp > 9) {
            int sum = 0;
            while (temp > 0) {
                sum += temp % 10;
                temp /= 10;
            }
            temp = sum;
        }

        if (temp == 1) {
            System.out.println(num + " is a magic number.");
        } else {
            System.out.println(num + " is not a magic number.");
        }

        sc.close();
    }
}
\`\`\`

Example: 1729 -> 1 + 7 + 2 + 9 = 19, then 1 + 9 = 10, then 1 + 0 = 1, so 1729 is a magic number.`
  }

  if (promptLower.includes('palindrome') && promptLower.includes('java')) {
    return `You asked for a Java program to check whether a number is a palindrome.

A palindrome number reads the same from left to right and right to left. For example, 121 is a palindrome.

\`\`\`java
import java.util.Scanner;

public class PalindromeNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        int original = num;
        int reverse = 0;

        while (num > 0) {
            int digit = num % 10;
            reverse = reverse * 10 + digit;
            num = num / 10;
        }

        if (original == reverse) {
            System.out.println(original + " is a palindrome number.");
        } else {
            System.out.println(original + " is not a palindrome number.");
        }

        sc.close();
    }
}
\`\`\`

You're doing a great job - keep practicing and stay curious!`
  }

  if (promptLower.includes('special number') && promptLower.includes('java')) {
    return `You asked for a Java program to check whether a number is a special number.

In many ICSE Java programs, a special number means the sum of the factorials of its digits is equal to the original number. For example, 145 is special because 1! + 4! + 5! = 145.

\`\`\`java
import java.util.Scanner;

public class SpecialNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        int temp = num;
        int sum = 0;

        while (temp > 0) {
            int digit = temp % 10;
            int fact = 1;

            for (int i = 1; i <= digit; i++) {
                fact = fact * i;
            }

            sum = sum + fact;
            temp = temp / 10;
        }

        if (sum == num) {
            System.out.println(num + " is a special number.");
        } else {
            System.out.println(num + " is not a special number.");
        }

        sc.close();
    }
}
\`\`\`

You're doing a great job - keep practicing and stay curious!`
  }

  if (/(write|create|make).*(program|code)|program.*(java|python|javascript|c\+\+)/.test(promptLower)) {
    return `You asked for a programming solution.

Here is a simple Java program structure that students can easily understand. You can change the logic inside the main method according to the exact problem.

\`\`\`java
import java.util.Scanner;

public class StudentProgram {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int num = sc.nextInt();

        System.out.println("You entered: " + num);

        sc.close();
    }
}
\`\`\`

You're doing a great job - keep practicing and stay curious!`
  }

  return ''
}

// Enhanced intelligent fallback that searches the offline knowledge base
export const generateIntelligentFallback = (avatarType, prompt) => {
  const programmingFallback = generateProgrammingFallback(prompt)
  if (programmingFallback) return programmingFallback

  // First, try to find a specific match in the offline knowledge base
  const avatarKnowledge = OFFLINE_KNOWLEDGE_BASE[avatarType]
  if (avatarKnowledge) {
    const promptLower = prompt.toLowerCase()
    
    // Search for specific topic matches
    for (const [topic, knowledge] of Object.entries(avatarKnowledge)) {
      if (topic !== 'default') {
        // Check if any keywords match the prompt
        const hasKeywordMatch = knowledge.keywords.some(keyword => 
          promptLower.includes(keyword)
        )
        
        if (hasKeywordMatch) {
          return knowledge.content
        }
      }
    }
    
    // Return default knowledge for the avatar
    return avatarKnowledge.default.content
  }
  
  // Get the specific avatar responses from fallbackResponses
  const avatarConfig = AVATAR_CONFIG[avatarType]
  const genericAvatarFallback = {
    default: avatarConfig
      ? `${avatarConfig.name} can help you with ${avatarConfig.domain}. Please ask your question again with a little more detail, and I will explain it step by step with simple examples.`
      : 'Please ask your question again with a little more detail, and I will explain it step by step with simple examples.'
  }
  const avatarResponses = fallbackResponses[avatarType] || genericAvatarFallback
  
  // Check if we have a specific response for the prompt
  const promptLower = prompt.toLowerCase()
  for (const [key, response] of Object.entries(avatarResponses)) {
    if (key === 'computer') {
      const asksComputerDefinition = /^(what is|define|explain)\s+(a\s+)?computer\??$/i.test(prompt.trim())
        || /^computer\??$/i.test(prompt.trim())
      if (asksComputerDefinition) {
        return response
      }
      continue
    }

    if (key !== 'default' && promptLower.includes(key)) {
      return response
    }
  }
  
  // Return default response for the avatar
  return avatarResponses.default || genericAvatarFallback.default
}
