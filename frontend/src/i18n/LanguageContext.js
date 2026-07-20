import React, { createContext, useContext, useMemo, useState } from 'react';

const STRINGS = {
  en: {
    appName: 'LinguaLab',
    appTagline: 'Practice English like a real exam, one focused mission at a time.',
    start: 'Start learning',
    loginCta: 'I already have an account',
    skip: 'Skip',
    next: 'Next',
    createAccount: 'Create account',
    login: 'Log in',
    register: 'Register',
    fullName: 'Full name',
    email: 'Email',
    password: 'Password',
    continue: 'Continue',
    demoMode: 'API offline: demo mode is active.',
    homeTitle: 'Today plan',
    homeSubtitle: 'Complete the speaking, vocabulary, and exam drills before your streak closes.',
    quiz: 'Quiz',
    chat: 'Chat',
    leaderboard: 'Leaderboard',
    admin: 'Admin',
    score: 'Score',
    streak: 'Streak',
    lessons: 'Lessons',
    accuracy: 'Accuracy',
    check: 'Check answer',
    nextQuestion: 'Next question',
    completeLesson: 'Complete lesson',
    correct: 'Correct answer',
    wrong: 'Try again',
    answer: 'Answer',
    send: 'Send',
    messagePlaceholder: 'Type a practice message...',
    topLearners: 'Top learners',
    questionBank: 'Question bank',
    analytics: 'Analytics',
    addQuestion: 'Add question',
    title: 'Title',
    options: 'Options separated by comma',
    category: 'Category',
    level: 'Level',
    save: 'Save',
    delete: 'Delete',
    emptyState: 'No live data yet, showing demo data for your presentation.',
    loading: 'Loading live data...',
    back: 'Back'
  },
  vi: {
    appName: 'LinguaLab',
    appTagline: 'Luyện tiếng Anh như một bài thi thật, từng nhiệm vụ rõ ràng mỗi ngày.',
    start: 'Bắt đầu học',
    loginCta: 'Tôi đã có tài khoản',
    skip: 'Bỏ qua',
    next: 'Tiếp theo',
    createAccount: 'Tạo tài khoản',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    fullName: 'Họ và tên',
    email: 'Email',
    password: 'Mật khẩu',
    continue: 'Tiếp tục',
    demoMode: 'API chưa sẵn sàng: đang chạy chế độ demo.',
    homeTitle: 'Kế hoạch hôm nay',
    homeSubtitle: 'Hoàn thành luyện nói, từ vựng và bài thi trước khi mất streak.',
    quiz: 'Bài thi',
    chat: 'Phòng chat',
    leaderboard: 'Xếp hạng',
    admin: 'Quản trị',
    score: 'Điểm',
    streak: 'Chuỗi ngày',
    lessons: 'Bài học',
    accuracy: 'Độ chính xác',
    check: 'Kiểm tra',
    nextQuestion: 'Câu tiếp',
    completeLesson: 'Hoàn thành bài',
    correct: 'Chính xác',
    wrong: 'Chưa đúng',
    answer: 'Đáp án',
    send: 'Gửi',
    messagePlaceholder: 'Nhập tin nhắn luyện tập...',
    topLearners: 'Học viên dẫn đầu',
    questionBank: 'Ngân hàng câu hỏi',
    analytics: 'Phân tích',
    addQuestion: 'Thêm câu hỏi',
    title: 'Tiêu đề',
    options: 'Các lựa chọn, cách nhau bởi dấu phẩy',
    category: 'Danh mục',
    level: 'Cấp độ',
    save: 'Lưu',
    delete: 'Xóa',
    emptyState: 'Chưa có dữ liệu live, đang dùng dữ liệu demo để thuyết trình.',
    loading: 'Đang tải dữ liệu live...',
    back: 'Quay lại'
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('vi');

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: STRINGS[language]
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
