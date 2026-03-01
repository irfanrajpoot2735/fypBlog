import React from 'react';
import aboutImg from "../assets/About-blog.avif"
import { Code2, Database, Palette, Rocket, Award, TrendingUp, Github, Linkedin, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const techStack = [
    { 
      category: "Frontend", 
      icon: <Code2 className="h-6 w-6" />,
      technologies: ["React.js", "Redux Toolkit", "Tailwind CSS", "Shadcn UI", "Vite", "Lucide Icons"]
    },
    { 
      category: "Backend", 
      icon: <Database className="h-6 w-6" />,
      technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT Authentication"]
    },
    { 
      category: "Features", 
      icon: <Rocket className="h-6 w-6" />,
      technologies: ["Rich Text Editor", "Image Cropping", "Dark Mode", "Badge System", "Milestone Tracking", "Real-time Stats"]
    },
    { 
      category: "Tools & Deployment", 
      icon: <Palette className="h-6 w-6" />,
      technologies: ["Git & GitHub", "VS Code", "Postman", "Cloudinary", "RESTful APIs"]
    }
  ];

  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 mb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="md:text-6xl text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About BuildNotes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A modern, feature-rich blogging platform designed to empower creators and inspire readers.
          </p>
        </div>

        {/* Image + Platform Overview */}
        <div className="mt-12 grid md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src={aboutImg}
            alt="BuildNotes Platform"
            className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow"
          />
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What is BuildNotes?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              BuildNotes is a comprehensive blogging platform that combines elegant design with powerful features. 
              Whether you're sharing tech tutorials, creative stories, or professional insights, BuildNotes provides 
              all the tools you need to engage your audience.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              With features like a rich text editor, image cropping, achievement badges, milestone tracking, 
              and real-time analytics, BuildNotes helps writers focus on what matters most—creating amazing content.
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Badge System</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {techStack.map((stack, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
                      {stack.icon}
                    </div>
                    {stack.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-xl font-bold mb-2">Rich Text Editor</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced editor with formatting, code blocks, and media embedding
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">Achievements</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn badges and track milestones as you grow your audience
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track views, likes, comments, and engagement metrics
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🖼️</div>
                <h3 className="text-xl font-bold mb-2">Image Cropping</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built-in image cropper for perfect thumbnails
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🌙</div>
                <h3 className="text-xl font-bold mb-2">Dark Mode</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seamless dark mode for comfortable reading
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-bold mb-2">Secure Auth</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  JWT-based authentication with secure sessions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Developer Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10">About the Developer</h2>
          <Card className="max-w-4xl mx-auto hover:shadow-2xl transition-shadow border-2">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    SK
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2">Saurabh Kumar</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Full Stack Developer & Creator</p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Hi! I'm Saurabh Kumar, a passionate full-stack developer specializing in the MERN stack. 
                    I built BuildNotes to combine my love for writing with modern web technologies. 
                    With expertise in React, Node.js, MongoDB, and modern UI frameworks, I create scalable 
                    and user-friendly applications.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    I believe in building products that solve real problems and provide delightful user experiences. 
                    BuildNotes represents my vision of what a modern blogging platform should be—powerful, 
                    intuitive, and beautiful.
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a 
                      href="https://github.com/saurabh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>
                    <a 
                      href="https://linkedin.com/in/saurabh-kumar" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                    </a>
                    <a 
                      href="mailto:saurabh@buildnotes.com"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <blockquote className="text-2xl italic text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            "To empower every writer with the tools they need to share their voice, 
            inspire others, and build meaningful connections through the power of words."
          </blockquote>
          <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
            Thank you for being part of the BuildNotes community. Let's build something amazing together! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
