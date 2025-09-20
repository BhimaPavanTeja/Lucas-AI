# **App Name**: Lucas

## Core Features:

- User Profile Display: Display the user's profile information, including name, email, career, skills, XP, and level. This is fetched upon login.
- Roadmap Display: Display the career roadmap with steps. This roadmap will be for the career specified in the user's profile, and fetched from Firestore.
- Quest Display: Display a list of quests for the current user, separated into daily and weekly quests.
- XP and Level Updates: Allow the user to click a button indicating a quest is complete. This triggers a call to the backend, which updates their XP and level in Firestore, and displays updated information to the user.
- Resource Vault: Display a collection of resources related to the user's career path, linking out to external URLs.
- Personalized Goal Generation: Use AI to generate personalized weekly goals based on the selected career path and current XP level. The AI tool takes into account career trends, the user's experience and goals.

## Style Guidelines:

- Primary color: HSL (210, 75%, 50%) which converts to a vibrant blue (#3399FF) to convey trust and forward movement in a career context.
- Background color: Light desaturated blue, HSL (210, 20%, 95%), converting to #F0F5FA.
- Accent color: A brighter analogous shade of purple to create contrast with CTAs and other interactive elements. HSL(240, 80%, 60%), which converts to #6666FF.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look, suitable for both headlines and body text.
- Use clean, modern icons from a set like Material Design Icons or Font Awesome, focusing on metaphors of growth, achievement, and direction.
- Employ a grid-based layout to ensure a clean and structured presentation. The user profile and the roadmap should be prominently displayed. Resources and quests should be easily accessible.
- Incorporate subtle animations when XP increases or levels up. This should provide positive feedback to the user, while maintaining a professional appearance.