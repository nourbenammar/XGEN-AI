// API service for XGen application
const API_BASE_URL = "http://127.0.0.1:5001";

// Helper to add format=json query parameter
const jsonUrl = (url) => {
  return url.includes("?") ? `${url}&format=json` : `${url}?format=json`;
};

/**
 * Teacher API - Document Management
 */
export const teacherAPI = {
  // Document operations
  async getDocuments() {
    const response = await fetch(jsonUrl(`${API_BASE_URL}/documents/`), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch documents");
    }

    return await response.json();
  },

  async getDocument(documentId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/documents/${documentId}`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch document ${documentId}`
      );
    }

    return await response.json();
  },

  async uploadDocument(formData) {
    // The formData already contains the document file and metadata
    const response = await fetch(jsonUrl(`${API_BASE_URL}/documents/upload`), {
      method: "POST",
      headers: {
        Accept: "application/json",
        // Don't set Content-Type for FormData - browser sets it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload document");
    }

    return await response.json();
  },

  async processDocument(documentId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/documents/${documentId}/process`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to process document ${documentId}`
      );
    }

    return await response.json();
  },

  async deleteDocument(documentId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/documents/${documentId}/delete`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to delete document ${documentId}`
      );
    }

    return await response.json();
  },

  // Chapter operations
  async getChapter(documentId, chapterId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/documents/${documentId}/chapter/${chapterId}`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch chapter ${chapterId}`
      );
    }

    return await response.json();
  },
};

/**
 * Student API - Chat Functionality
 */
export const studentAPI = {
  // Document list for chat
  async getChatDocuments() {
    const response = await fetch(jsonUrl(`${API_BASE_URL}/chat/documents`), {
      headers: {
        Accept: "application/json",
      },
      credentials: "include", // Important for session cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch chat documents");
    }

    return await response.json();
  },

  async getChatSessions() {
    const response = await fetch(jsonUrl(`${API_BASE_URL}/chat/sessions`), {
      headers: {
        Accept: "application/json",
      },
      credentials: "include", // Important for session cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch chat sessions");
    }

    return await response.json();
  },

  async getDocumentForChat(documentId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/chat/start/${documentId}`),
      {
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to get document ${documentId} for chat`
      );
    }

    return await response.json();
  },

  async startChat(documentId, sessionName) {
    const formData = new FormData();
    formData.append("session_name", sessionName);

    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/chat/start/${documentId}`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Don't set Content-Type for FormData
        },
        body: formData,
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to start chat for document ${documentId}`
      );
    }

    return await response.json();
  },

  async getChatSession(sessionId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/chat/session/${sessionId}`),
      {
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to get chat session ${sessionId}`
      );
    }

    return await response.json();
  },

  async deleteSession(sessionId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/chat/session/${sessionId}/delete`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to delete session ${sessionId}`
      );
    }

    return await response.json();
  },

  // Chat messages
  async getChatMessages(sessionId) {
    const response = await fetch(
      `${API_BASE_URL}/chat/session/${sessionId}/messages`,
      {
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch messages for session ${sessionId}`
      );
    }

    return await response.json();
  },

  async askQuestion(sessionId, question, options = {}) {
    const payload = {
      question,
      ...options, // Additional options like retrieval_strategy, top_k, etc.
    };

    const response = await fetch(
      `${API_BASE_URL}/chat/session/${sessionId}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to send question");
    }

    return await response.json();
  },

  async provideFeedback(sessionId, messageId, feedbackData) {
    const payload = {
      message_id: messageId,
      ...feedbackData,
    };

    const response = await fetch(
      `${API_BASE_URL}/chat/session/${sessionId}/feedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Important for session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to submit feedback");
    }

    return await response.json();
  },
};

/**
 * Course Generator API - Syllabus Processing and Course Generation
 */
export const courseGeneratorAPI = {
  // Get all generated courses
  async getCourses() {
    const response = await fetch(jsonUrl(`${API_BASE_URL}/courses`), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch courses");
    }

    return await response.json();
  },

  // Upload a syllabus file
  async uploadSyllabus(file, metadata = {}) {
    const formData = new FormData();
    formData.append("file", file);

    // Add any additional metadata
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(jsonUrl(`${API_BASE_URL}/upload-syllabus`), {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload syllabus");
    }

    return await response.json();
  },

  // Generate course materials from a syllabus
  async generateCourse(fileId, options = {}) {
    const payload = {
      file_id: fileId,
      ...options,
    };

    const response = await fetch(jsonUrl(`${API_BASE_URL}/generate-course`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate course");
    }

    return await response.json();
  },

  // Get course generation status
  async getCourseStatus(courseId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/courses/${courseId}/status`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to get status for course ${courseId}`
      );
    }

    return await response.json();
  },

  // Get course details
  async getCourseDetails(courseId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/courses/${courseId}`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to get details for course ${courseId}`
      );
    }

    return await response.json();
  },

  // Get a specific file from a course
  async getCourseFile(courseId, filePath) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/courses/${courseId}/files/${filePath}`),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Failed to get file ${filePath} from course ${courseId}`
      );
    }

    return await response.json();
  },

  // Get PowerPoint slides content
  async getCourseSlides(courseId, filePath) {
    const response = await fetch(
      `${API_BASE_URL}/courses/${courseId}/files/${filePath}?format=slides`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Failed to get slides for ${filePath} from course ${courseId}`
      );
    }

    return await response.json();
  },

  // Download all course materials as a zip file
  async downloadCourse(courseId) {
    window.location.href = `${API_BASE_URL}/courses/${courseId}/download`;
    return true;
  },

  // Download a specific file
  downloadFile(courseId, filePath) {
    window.open(
      `${API_BASE_URL}/courses/${courseId}/files/${filePath}?format=download`,
      "_blank"
    );
    return true;
  },

  // Delete a course
  async deleteCourse(courseId) {
    const response = await fetch(
      jsonUrl(`${API_BASE_URL}/courses/${courseId}`),
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete course ${courseId}`);
    }

    return await response.json();
  },
};

export default {
  teacher: teacherAPI,
  student: studentAPI,
  courseGenerator: courseGeneratorAPI,
};
