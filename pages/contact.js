import { useState , useEffect} from "react";
import Layout from "@/components/Layout";
import jwt_decode from "jwt-decode";
import Link from "next/link";
export default function Contact() {
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState(""); 
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);
        setUserEmail(decodedToken.email);
      }
    }, []);

    const handleFeedbackChange = (e) => {
      setFeedback(e.target.value);

    };

    
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch("/api/submitFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback, userEmail }),
        });
  
        if (response.ok) {
          setMessage("Feedback submitted successfully.");
          setFeedback("");
        } else {
          setMessage("Failed to submit feedback.");
        }
      } catch (error) {
        setMessage("An error occurred while submitting the feedback:", error);
      }
    };
  return (
    <Layout>
      <div className=" min-h-screen pt-16">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="mb-6">
              Welcome to our store! We are a dedicated team passionate about providing high-quality products to our customers. Our mission is to create an exceptional shopping experience and deliver products that exceed expectations.
            </p>
            <p className="mb-6">
              At our store, we offer a wide range of products that cater to various needs and preferences. From home decor and furniture to electronics and fashion, we strive to curate a diverse collection that meets the demands of our customers.
            </p>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="mb-6">
              We value your feedback and are here to assist you with any inquiries you may have. Reach out to us via the contact information provided below, and well be happy to help.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <p className="mb-6">
              Phone: 98765432
            </p>
            <p className="mb-6">
              Email: info@example.com
            </p>
            <p className="mb-6">
              Our customer support team is available to assist you during business hours. If you have any questions, concerns, or feedback, please dont hesitate to get in touch with us. We strive to provide prompt and helpful assistance to ensure your satisfaction.
            </p>
            <h3 className="text-2xl font-bold mb-4">Send Feedback</h3>
            <p className="mb-6 text-red-500 font-bold">
              {message}
            </p>
           
              {userId ? (
                
            <form onSubmit={handleSubmit}>
            <p className="mb-6">
                Please enter your feedback below. We appreciate your input!<br></br>
                You are logged in as {userEmail}.
              </p>
              
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter your feedback..."
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
              ) : (
                <div>
                  <p className="mb-6">
                    Please <Link href="/login">login</Link> to submit feedback.
                  </p>
                  </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
