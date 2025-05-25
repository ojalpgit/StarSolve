StarSolve

Conquer the galaxy with one math problem at a time!

Inspiration
While tutoring elementary students at a local school, I noticed that whenever we talked about anything big, their eyes lit up. Whether it was towering superheroes, mythical creatures, or the vastness of outer space, they were captivated by the sheer scale and wonder of it all. That fascination stuck with me.
At the same time, I saw how many of those same students struggled with math not because they weren’t smart, but because the way it was presented often lacked imagination. So I started thinking: what if math could be the key to something epic?
That’s how StarSolve was born. My partner and I wanted to build a world where students could unleash their curiosity and creativity. A world where solving math problems wasn’t just about getting the right answer, but about building your own empire, defending planets, and exploring a galaxy. A place where math is the magic that powers your universe.
This project is our way of blending wonder with learning and giving kids the freedom to dream big, while sneaking in the STEM skills that help them reach for the stars.


What is StarSolve and How We Built it: A Math Adventure Across the Galaxy 
StarSolve is a web-based 3D educational game developed using Three.js, HTML/CSS, and JavaScript. Our goal was to create an immersive, interactive environment that makes math learning engaging through exploration and challenge.

Tech Stack
Three.js: For rendering a dynamic solar system with orbiting planets and real-time camera controls.
JavaScript (Vanilla): For managing game logic, question generation, user input validation, and game progression.
HTML/CSS: For structuring the interface and styling the game panels, buttons, and feedback messages.

Core Components We Built
3D Solar System
We used Three.js to create a scene with a glowing sun and eight orbiting planets. Each planet is textured using realistic images and animated to revolve around the sun. OrbitControls (with damping) allows users to smoothly rotate, zoom, and pan through space.
Math Engine
Built a custom difficulty scaling system where math difficulty increases as the game progresses.
Questions are randomly generated, and correct answers reward the user with coins.
Incorrect answers prompt retry opportunities without penalties to encourage learning.
Planet Unlocking System
We used JavaScript to implement this system where planets are unlocked using coins earned from solving math questions.
Each planet has a progressively higher cost, which motivates users to continue solving problems.
We implemented a coin economy system that tracks earnings and deducts costs on unlock.
Interactive UI Panels
HTML was used to build the interface featuring a math challenge panel, an info panel for planet details, and a log panel to track progress.
Clicking on a planet brings up its unique name, difficulty level, and a fun fact.
The log updates every time a planet is unlocked, building a sense of achievement and progression.
Camera Reset & Enhancements
To prevent users from getting lost in the 3D space, we included a “Reset View” button in Three.js that brings the camera back to a default orbital view.


What We Learned
- We deepened our understanding of 3D rendering with Three.js and how to optimize performance in web-based visualizations.
- Managing game state transitions (e.g., from question answering to unlocking a planet) was a great exercise in event-driven programming.
- We learned how to design scalable and modular game architecture, allowing us to easily add new features like question generators and coin systems without rewriting core components.


Challenges we faced
One of the biggest challenges we faced was balancing educational value with engagement. Designing a platform that made math fun without watering down the content required multiple iterations of both UI and game mechanics. We wanted to ensure that students weren't just guessing answers to earn coins but were actually learning through progressively challenging problems including word problems tied to in-game scenarios.
Another key challenge was building a scalable and modular architecture from scratch. As our idea evolved, we kept adding features like coin-based progression, question generation, and orbit-based zoom transitions for planet interactions. Managing this growing complexity pushed us to learn how to structure our code more efficiently and build reusable components, which ultimately made the app more stable and easier to expand. This means the platform isn't just a one-off game, it's a foundation that can grow into a broader universe of STEM challenges.
We also had troubles with creating a seamless and intuitive user experience that appealed to middle schoolers. This led us to experiment with animations, visual feedback (planet zooms), and a progression system that motivates users to solve problems in order to unlock new planets and protect their empire.

Accomplishments that we're proud of
We’re proud of the technical depth and polish we brought to the project in a short timeframe. From implementing smooth camera transitions and orbiting animations to dynamically generating math questions of increasing difficulty, every element was thoughtfully engineered to be educational and enjoyable.

What's next for StarSolve
StarSolve is just getting started. Our next step is to add different levels of difficulty to better challenge students as they improve, and introduce new and uniquely themed planets that each offer distinct types of math problems. We envision a universe with endless galaxies, each filled with interactive challenges, engaging word problems, and exciting educational content which turn math practice into an epic space adventure.
 We also plan to implement adaptive learning, where the difficulty adjusts based on a student’s performance, ensuring a personalized and motivating experience. To support teachers, we’ll build a classroom dashboard where they can track student progress, assign planets as homework, and reward achievements.

On the technical side, we’re exploring multiplayer modes where students can collaboratively defend planets or challenge each other with custom word problems which will make math social, competitive, and fun.
Long-term, we want to partner with educators and curriculum designers to align StarSolve with learning standards and bring it into real classrooms, especially in under-resourced schools. Our goal is to make STEM learning feel like an adventure while also being accessible, exciting, and unforgettable.
