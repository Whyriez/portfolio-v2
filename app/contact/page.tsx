"use client";
import React, { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        const successMessageDiv = document.getElementById("successMessage");
        if (successMessageDiv) {
          successMessageDiv.classList.remove("hidden");
          setTimeout(() => {
            successMessageDiv.classList.add("hidden");
          }, 5000);
        }
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to send message:",
          errorData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <section id="contactPage" className="page-section active">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Get In Touch</h2>
      <p className="text-gray-600 mb-12">
        Have a project in mind or want to collaborate? I'd love to hear from
        you.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="lg:w-3/5">
          <div className="glassmorphism rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Me a Message
            </h3>

            <form
              id="contactForm"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Project Inquiry"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 bg-opacity-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="newsletter"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Subscribe to my newsletter for tips and updates
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>

            <div
              id="successMessage"
              className="hidden success-message mt-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg text-center"
            >
              <svg
                className="w-6 h-6 text-green-500 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <p className="font-medium">
                Thank you! Your message has been sent successfully.
              </p>
              <p className="text-sm mt-1">
                I'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-2/5">
          <div className="space-y-6">
            <div className="glassmorphism contact-card rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600 contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                <a
                  href="mailto:alimsuma@limapp.my.id"
                  className="text-blue-600 hover:underline"
                >
                  alimsuma@limapp.my.id
                </a>
              </div>
            </div>

            <div className="glassmorphism contact-card rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600 contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Phone</h4>
                <a
                  href="tel:+62895707491166"
                  className="text-purple-600 hover:underline"
                >
                  +62 (895) 7074-91166
                </a>
              </div>
            </div>

            <div className="glassmorphism contact-card rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600 contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Location
                </h4>
                <p className="text-green-600">Gorontalo, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
