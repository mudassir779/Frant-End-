import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const AddTestimonialForm = ({ onTestimonialSubmit }) => {
  const backendLink = useSelector((state) => state.prod.link);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSubmissionLabel, setShowSubmissionLabel] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   setError("");

  //   try { 
  //     const response = await axios.post(
  //       `${backendLink}/api/testimonials/create-testimonials`,
  //       formData,
  //       {
  //           headers: {
  //               'Content-Type': 'application/json'
  //           }
  //       }
  //     );
  //     onTestimonialSubmit(response.data); // Update parent component
  //     setFormData({ name: "", rating: 5, content: "" }); // Reset form
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to submit testimonial");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setShowSubmissionLabel(true);

    try {
      console.log("Backend URL:", backendLink);
      console.log("Form data:", formData);

      const response = await axios.post(
        `${backendLink}/api/testimonials/create-testimonials`,
        {
          name: formData.name,
          rating: formData.rating,
          content: formData.content
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Response:", response.data);
      onTestimonialSubmit(response.data); // Update parent component
      setFormData({ name: "", rating: 5, content: "" }); // Reset form
      setSuccess(true);
      setShowSubmissionLabel(false); // Hide submission label immediately on success
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      // Provide more specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Please check your input and try again");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError(err.response?.data?.message || "Failed to submit testimonial");
      }
    } finally {
      setSubmitting(false);
      // Hide submission label after 2 seconds
      setTimeout(() => {
        setShowSubmissionLabel(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
      
      {/* Submission Label at the top */}
      {showSubmissionLabel && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          Submitting your testimonial...
        </div>
      )}
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Thank you! Your testimonial has been submitted successfully.</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Rating Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <FaStar
                  className={`text-2xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Field */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="content"
            name="content"
            rows="4"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonialForm;
