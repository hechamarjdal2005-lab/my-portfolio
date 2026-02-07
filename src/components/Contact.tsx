import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram, MapPin, Send, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/lib/supabase';
import { useProfile } from "@/pages/hooks/useProfile";

const Contact = () => {
  const { profile, loading: profileLoading } = useProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // إنشاء قائمة الروابط الاجتماعية من البيانات
  const getContactLinks = () => {
    if (!profile) return [];

    const links = [];

    if (profile.email) {
      links.push({
        icon: Mail,
        label: "Email",
        value: profile.email,
        href: `mailto:${profile.email}`,
      });
    }

    if (profile.github_url) {
      links.push({
        icon: Github,
        label: "GitHub",
        value: profile.github_url.replace(/https?:\/\/(www\.)?github\.com\//i, '@'),
        href: profile.github_url,
      });
    }

    if (profile.linkedin_url) {
      links.push({
        icon: Linkedin,
        label: "LinkedIn",
        value: profile.name,
        href: profile.linkedin_url,
      });
    }

    if (profile.instagram_url) {
      links.push({
        icon: Instagram,
        label: "Instagram",
        value: profile.instagram_url.replace(/https?:\/\/(www\.)?instagram\.com\//i, '@'),
        href: profile.instagram_url,
      });
    }

    if (profile.twitter_url) {
      links.push({
        icon: Twitter,
        label: "Twitter",
        value: profile.twitter_url.replace(/https?:\/\/(www\.)?twitter\.com\//i, '@').replace(/https?:\/\/(www\.)?x\.com\//i, '@'),
        href: profile.twitter_url,
      });
    }

    if (profile.phone) {
      links.push({
        icon: Phone,
        label: "Phone",
        value: profile.phone,
        href: `tel:${profile.phone}`,
      });
    }

    return links;
  };

  const contactLinks = getContactLinks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) {
        console.error('Error:', error);
        alert('Error sending message');
      } else {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (profileLoading) {
    return (
      <section id="contact" className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
            Have a project in mind? Let's work together and create something amazing.
          </p>
          <div className="w-16 sm:w-20 h-1 gradient-bg rounded-full mx-auto mt-3 sm:mt-4" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Info Section */}
            <motion.div
              className="space-y-4 sm:space-y-6 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Let's Connect
                </h3>

                {profile?.location && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <span className="break-words">{profile.location}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  {contactLinks.length > 0 ? (
                    contactLinks.map((contact, index) => (
                      <motion.a
                        key={contact.label}
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                          <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-muted-foreground">{contact.label}</p>
                          <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors break-all">
                            {contact.value}
                          </p>
                        </div>
                      </motion.a>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm sm:text-base">No contact information available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Form Section */}
            <motion.div
              className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground flex items-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2.5 sm:py-3"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : success ? 'Sent! ✓' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;