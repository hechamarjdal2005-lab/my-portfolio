// Real Technology Logos using react-icons
// This file maps technology names to their actual brand icons from react-icons/si

export interface TechIcon {
  name: string;
  // Icon name from react-icons/si (Simple Icons)
  iconName: string;
  color: string;
  category: string;
  keywords: string[];
}

// Comprehensive list of technologies with their REAL logos
export const techIcons: TechIcon[] = [
  // Frontend Frameworks & Libraries
  { name: "React", iconName: "SiReact", color: "#61DAFB", category: "Frontend", keywords: ["react", "reactjs", "react.js", "jsx"] },
  { name: "Vue.js", iconName: "SiVuedotjs", color: "#4FC08D", category: "Frontend", keywords: ["vue", "vuejs", "vue.js"] },
  { name: "Angular", iconName: "SiAngular", color: "#DD0031", category: "Frontend", keywords: ["angular", "angularjs"] },
  { name: "Svelte", iconName: "SiSvelte", color: "#FF3E00", category: "Frontend", keywords: ["svelte", "sveltekit"] },
  { name: "Next.js", iconName: "SiNextdotjs", color: "#000000", category: "Frontend", keywords: ["next", "nextjs", "next.js"] },
  { name: "Nuxt.js", iconName: "SiNuxtdotjs", color: "#00DC82", category: "Frontend", keywords: ["nuxt", "nuxtjs", "nuxt.js"] },
  { name: "Remix", iconName: "SiRemix", color: "#000000", category: "Frontend", keywords: ["remix", "remixjs"] },
  { name: "Astro", iconName: "SiAstro", color: "#FF5D01", category: "Frontend", keywords: ["astro", "astrojs"] },
  
  // Languages
  { name: "JavaScript", iconName: "SiJavascript", color: "#F7DF1E", category: "Languages", keywords: ["javascript", "js", "es6", "ecmascript"] },
  { name: "TypeScript", iconName: "SiTypescript", color: "#3178C6", category: "Languages", keywords: ["typescript", "ts"] },
  { name: "Python", iconName: "SiPython", color: "#3776AB", category: "Languages", keywords: ["python", "py"] },
  { name: "Java", iconName: "SiOpenjdk", color: "#000000", category: "Languages", keywords: ["java", "jdk"] },
  { name: "C++", iconName: "SiCplusplus", color: "#00599C", category: "Languages", keywords: ["c++", "cpp", "cplusplus"] },
  { name: "C#", iconName: "SiCsharp", color: "#239120", category: "Languages", keywords: ["c#", "csharp", "dotnet"] },
  { name: "C", iconName: "SiC", color: "#A8B9CC", category: "Languages", keywords: ["c"] },
  { name: "Go", iconName: "SiGo", color: "#00ADD8", category: "Languages", keywords: ["go", "golang"] },
  { name: "Rust", iconName: "SiRust", color: "#000000", category: "Languages", keywords: ["rust", "rs"] },
  { name: "PHP", iconName: "SiPhp", color: "#777BB4", category: "Languages", keywords: ["php"] },
  { name: "Ruby", iconName: "SiRuby", color: "#CC342D", category: "Languages", keywords: ["ruby", "rb"] },
  { name: "Swift", iconName: "SiSwift", color: "#F05138", category: "Languages", keywords: ["swift", "ios"] },
  { name: "Kotlin", iconName: "SiKotlin", color: "#7F52FF", category: "Languages", keywords: ["kotlin"] },
  { name: "Dart", iconName: "SiDart", color: "#0175C2", category: "Languages", keywords: ["dart"] },
  { name: "R", iconName: "SiR", color: "#276DC3", category: "Languages", keywords: ["r", "rstats"] },
  { name: "Scala", iconName: "SiScala", color: "#DC322F", category: "Languages", keywords: ["scala"] },
  { name: "Elixir", iconName: "SiElixir", color: "#4B275F", category: "Languages", keywords: ["elixir"] },
  { name: "Haskell", iconName: "SiHaskell", color: "#5D4F85", category: "Languages", keywords: ["haskell"] },
  
  // CSS & Styling
  { name: "CSS3", iconName: "SiCss3", color: "#1572B6", category: "Styling", keywords: ["css", "css3", "styles"] },
  { name: "HTML5", iconName: "SiHtml5", color: "#E34F26", category: "Styling", keywords: ["html", "html5"] },
  { name: "Sass", iconName: "SiSass", color: "#CC6699", category: "Styling", keywords: ["sass", "scss"] },
  { name: "Tailwind CSS", iconName: "SiTailwindcss", color: "#06B6D4", category: "Styling", keywords: ["tailwind", "tailwindcss"] },
  { name: "Bootstrap", iconName: "SiBootstrap", color: "#7952B3", category: "Styling", keywords: ["bootstrap"] },
  { name: "Material-UI", iconName: "SiMui", color: "#007FFF", category: "Styling", keywords: ["mui", "material-ui", "materialui"] },
  { name: "Styled Components", iconName: "SiStyledcomponents", color: "#DB7093", category: "Styling", keywords: ["styled-components", "styledcomponents"] },
  
  // Backend & Runtime
  { name: "Node.js", iconName: "SiNodedotjs", color: "#339933", category: "Backend", keywords: ["node", "nodejs", "node.js"] },
  { name: "Express", iconName: "SiExpress", color: "#000000", category: "Backend", keywords: ["express", "expressjs"] },
  { name: "NestJS", iconName: "SiNestjs", color: "#E0234E", category: "Backend", keywords: ["nest", "nestjs"] },
  { name: "Fastify", iconName: "SiFastify", color: "#000000", category: "Backend", keywords: ["fastify"] },
  { name: "Django", iconName: "SiDjango", color: "#092E20", category: "Backend", keywords: ["django"] },
  { name: "Flask", iconName: "SiFlask", color: "#000000", category: "Backend", keywords: ["flask"] },
  { name: "FastAPI", iconName: "SiFastapi", color: "#009688", category: "Backend", keywords: ["fastapi"] },
  { name: "Spring", iconName: "SiSpring", color: "#6DB33F", category: "Backend", keywords: ["spring", "springboot"] },
  { name: "Laravel", iconName: "SiLaravel", color: "#FF2D20", category: "Backend", keywords: ["laravel"] },
  { name: "Rails", iconName: "SiRubyonrails", color: "#CC0000", category: "Backend", keywords: ["rails", "ruby on rails", "rubyonrails"] },
  { name: "Nginx", iconName: "SiNginx", color: "#009639", category: "Backend", keywords: ["nginx"] },
  { name: "Apache", iconName: "SiApache", color: "#D22128", category: "Backend", keywords: ["apache"] },
  
  // Databases
  { name: "MongoDB", iconName: "SiMongodb", color: "#47A248", category: "Database", keywords: ["mongodb", "mongo", "nosql"] },
  { name: "PostgreSQL", iconName: "SiPostgresql", color: "#4169E1", category: "Database", keywords: ["postgresql", "postgres", "psql"] },
  { name: "MySQL", iconName: "SiMysql", color: "#4479A1", category: "Database", keywords: ["mysql"] },
  { name: "Redis", iconName: "SiRedis", color: "#DC382D", category: "Database", keywords: ["redis"] },
  { name: "SQLite", iconName: "SiSqlite", color: "#003B57", category: "Database", keywords: ["sqlite"] },
  { name: "MariaDB", iconName: "SiMariadb", color: "#003545", category: "Database", keywords: ["mariadb"] },
  { name: "Firebase", iconName: "SiFirebase", color: "#FFCA28", category: "Database", keywords: ["firebase"] },
  { name: "Supabase", iconName: "SiSupabase", color: "#3ECF8E", category: "Database", keywords: ["supabase"] },
  { name: "Prisma", iconName: "SiPrisma", color: "#2D3748", category: "Database", keywords: ["prisma"] },
  { name: "Elasticsearch", iconName: "SiElasticsearch", color: "#005571", category: "Database", keywords: ["elasticsearch", "elastic"] },
  { name: "Cassandra", iconName: "SiApachecassandra", color: "#1287B1", category: "Database", keywords: ["cassandra"] },
  { name: "DynamoDB", iconName: "SiAmazondynamodb", color: "#4053D6", category: "Database", keywords: ["dynamodb"] },
  
  // DevOps & Cloud
  { name: "Docker", iconName: "SiDocker", color: "#2496ED", category: "DevOps", keywords: ["docker", "container"] },
  { name: "Kubernetes", iconName: "SiKubernetes", color: "#326CE5", category: "DevOps", keywords: ["kubernetes", "k8s"] },
  { name: "AWS", iconName: "SiAmazonaws", color: "#232F3E", category: "DevOps", keywords: ["aws", "amazon web services"] },
  { name: "Azure", iconName: "SiMicrosoftazure", color: "#0078D4", category: "DevOps", keywords: ["azure", "microsoft azure"] },
  { name: "Google Cloud", iconName: "SiGooglecloud", color: "#4285F4", category: "DevOps", keywords: ["gcp", "google cloud", "googlecloud"] },
  { name: "Vercel", iconName: "SiVercel", color: "#000000", category: "DevOps", keywords: ["vercel"] },
  { name: "Netlify", iconName: "SiNetlify", color: "#00C7B7", category: "DevOps", keywords: ["netlify"] },
  { name: "Heroku", iconName: "SiHeroku", color: "#430098", category: "DevOps", keywords: ["heroku"] },
  { name: "DigitalOcean", iconName: "SiDigitalocean", color: "#0080FF", category: "DevOps", keywords: ["digitalocean"] },
  { name: "Jenkins", iconName: "SiJenkins", color: "#D24939", category: "DevOps", keywords: ["jenkins", "ci/cd"] },
  { name: "CircleCI", iconName: "SiCircleci", color: "#343434", category: "DevOps", keywords: ["circleci", "ci/cd"] },
  { name: "GitHub Actions", iconName: "SiGithubactions", color: "#2088FF", category: "DevOps", keywords: ["github actions", "actions", "ci/cd"] },
  { name: "Terraform", iconName: "SiTerraform", color: "#7B42BC", category: "DevOps", keywords: ["terraform", "iac"] },
  { name: "Ansible", iconName: "SiAnsible", color: "#EE0000", category: "DevOps", keywords: ["ansible"] },
  
  // Version Control & Tools
  { name: "Git", iconName: "SiGit", color: "#F05032", category: "Tools", keywords: ["git"] },
  { name: "GitHub", iconName: "SiGithub", color: "#181717", category: "Tools", keywords: ["github"] },
  { name: "GitLab", iconName: "SiGitlab", color: "#FC6D26", category: "Tools", keywords: ["gitlab"] },
  { name: "Bitbucket", iconName: "SiBitbucket", color: "#0052CC", category: "Tools", keywords: ["bitbucket"] },
  { name: "VS Code", iconName: "SiVisualstudiocode", color: "#007ACC", category: "Tools", keywords: ["vscode", "visual studio code", "code editor", "ide"] },
  { name: "IntelliJ IDEA", iconName: "SiIntellijidea", color: "#000000", category: "Tools", keywords: ["intellij", "idea", "jetbrains"] },
  { name: "WebStorm", iconName: "SiWebstorm", color: "#000000", category: "Tools", keywords: ["webstorm", "jetbrains"] },
  { name: "PyCharm", iconName: "SiPycharm", color: "#000000", category: "Tools", keywords: ["pycharm", "jetbrains"] },
  { name: "Vim", iconName: "SiVim", color: "#019733", category: "Tools", keywords: ["vim", "vi"] },
  { name: "Sublime Text", iconName: "SiSublimetext", color: "#FF9800", category: "Tools", keywords: ["sublime", "sublime text"] },
  { name: "Postman", iconName: "SiPostman", color: "#FF6C37", category: "Tools", keywords: ["postman", "api"] },
  { name: "Insomnia", iconName: "SiInsomnia", color: "#4000BF", category: "Tools", keywords: ["insomnia", "api"] },
  { name: "Slack", iconName: "SiSlack", color: "#4A154B", category: "Tools", keywords: ["slack"] },
  { name: "Discord", iconName: "SiDiscord", color: "#5865F2", category: "Tools", keywords: ["discord"] },
  
  // Build Tools & Package Managers
  { name: "npm", iconName: "SiNpm", color: "#CB3837", category: "Tools", keywords: ["npm"] },
  { name: "Yarn", iconName: "SiYarn", color: "#2C8EBB", category: "Tools", keywords: ["yarn"] },
  { name: "pnpm", iconName: "SiPnpm", color: "#F69220", category: "Tools", keywords: ["pnpm"] },
  { name: "Webpack", iconName: "SiWebpack", color: "#8DD6F9", category: "Tools", keywords: ["webpack"] },
  { name: "Vite", iconName: "SiVite", color: "#646CFF", category: "Tools", keywords: ["vite", "vitejs"] },
  { name: "Rollup", iconName: "SiRollupdotjs", color: "#EC4A3F", category: "Tools", keywords: ["rollup"] },
  { name: "Babel", iconName: "SiBabel", color: "#F9DC3E", category: "Tools", keywords: ["babel"] },
  
  // Testing
  { name: "Jest", iconName: "SiJest", color: "#C21325", category: "Testing", keywords: ["jest"] },
  { name: "Vitest", iconName: "SiVitest", color: "#6E9F18", category: "Testing", keywords: ["vitest"] },
  { name: "Cypress", iconName: "SiCypress", color: "#17202C", category: "Testing", keywords: ["cypress"] },
  { name: "Playwright", iconName: "SiPlaywright", color: "#2EAD33", category: "Testing", keywords: ["playwright"] },
  
  // State Management
  { name: "Redux", iconName: "SiRedux", color: "#764ABC", category: "State", keywords: ["redux"] },
  
  // Mobile
  { name: "React Native", iconName: "SiReact", color: "#61DAFB", category: "Mobile", keywords: ["react native", "reactnative", "rn"] },
  { name: "Flutter", iconName: "SiFlutter", color: "#02569B", category: "Mobile", keywords: ["flutter"] },
  { name: "Expo", iconName: "SiExpo", color: "#000020", category: "Mobile", keywords: ["expo"] },
  
  // GraphQL & APIs
  { name: "GraphQL", iconName: "SiGraphql", color: "#E10098", category: "API", keywords: ["graphql"] },
  { name: "Apollo", iconName: "SiApollographql", color: "#311C87", category: "API", keywords: ["apollo", "apollographql"] },
  
  // AI/ML
  { name: "TensorFlow", iconName: "SiTensorflow", color: "#FF6F00", category: "AI/ML", keywords: ["tensorflow"] },
  { name: "PyTorch", iconName: "SiPytorch", color: "#EE4C2C", category: "AI/ML", keywords: ["pytorch"] },
  { name: "OpenAI", iconName: "SiOpenai", color: "#412991", category: "AI/ML", keywords: ["openai", "chatgpt", "gpt"] },
  
  // CMS & Platforms
  { name: "WordPress", iconName: "SiWordpress", color: "#21759B", category: "CMS", keywords: ["wordpress", "wp"] },
  { name: "Shopify", iconName: "SiShopify", color: "#7AB55C", category: "CMS", keywords: ["shopify"] },
  { name: "Strapi", iconName: "SiStrapi", color: "#2F2E8B", category: "CMS", keywords: ["strapi"] },
  
  // Design & UI
  { name: "Figma", iconName: "SiFigma", color: "#F24E1E", category: "Design", keywords: ["figma", "design"] },
  { name: "Adobe XD", iconName: "SiAdobexd", color: "#FF61F6", category: "Design", keywords: ["xd", "adobe xd"] },
  { name: "Sketch", iconName: "SiSketch", color: "#F7B500", category: "Design", keywords: ["sketch"] },
  
  // Monitoring & Analytics
  { name: "Sentry", iconName: "SiSentry", color: "#362D59", category: "Monitoring", keywords: ["sentry"] },
  { name: "New Relic", iconName: "SiNewrelic", color: "#008C99", category: "Monitoring", keywords: ["newrelic", "new relic"] },
  { name: "Datadog", iconName: "SiDatadog", color: "#632CA6", category: "Monitoring", keywords: ["datadog"] },
  
  // Operating Systems
  { name: "Linux", iconName: "SiLinux", color: "#FCC624", category: "OS", keywords: ["linux", "unix"] },
  { name: "Ubuntu", iconName: "SiUbuntu", color: "#E95420", category: "OS", keywords: ["ubuntu"] },
];

/**
 * Get icon suggestions based on skill name with REAL logos
 */
export function getSmartIconSuggestions(skillName: string, limit: number = 8): TechIcon[] {
  const normalizedSkillName = skillName.toLowerCase().trim();
  
  if (!normalizedSkillName) {
    // Return popular defaults
    return techIcons.slice(0, limit);
  }

  // Score each icon based on keyword matching
  const scored = techIcons.map(tech => {
    let score = 0;
    
    // Exact name match
    if (tech.name.toLowerCase() === normalizedSkillName) {
      score += 200;
    }
    
    // Exact keyword match
    if (tech.keywords.some(kw => kw === normalizedSkillName)) {
      score += 150;
    }
    
    // Keyword contains skill name
    if (tech.keywords.some(kw => kw.includes(normalizedSkillName))) {
      score += 80;
    }
    
    // Skill name contains keyword
    if (tech.keywords.some(kw => normalizedSkillName.includes(kw))) {
      score += 50;
    }
    
    // Name similarity
    if (tech.name.toLowerCase().includes(normalizedSkillName)) {
      score += 40;
    }
    
    // Partial word matching
    const words = normalizedSkillName.split(/[\s-_]+/);
    words.forEach(word => {
      if (word.length > 2) {
        if (tech.keywords.some(kw => kw.includes(word) || word.includes(kw))) {
          score += 20;
        }
      }
    });
    
    return { tech, score };
  });

  // Sort by score and return top suggestions
  const suggestions = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.tech);

  // If we have suggestions, return them
  if (suggestions.length > 0) {
    return suggestions;
  }

  // Fallback: return popular ones
  return techIcons.slice(0, limit);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(techIcons.map(t => t.category))).sort();
}

/**
 * Get icons by category
 */
export function getIconsByCategory(category: string): TechIcon[] {
  return techIcons.filter(t => t.category === category);
}

/**
 * Search icons by name
 */
export function searchIcons(query: string): TechIcon[] {
  const normalizedQuery = query.toLowerCase();
  return techIcons.filter(tech => 
    tech.name.toLowerCase().includes(normalizedQuery) ||
    tech.keywords.some(kw => kw.includes(normalizedQuery))
  );
}