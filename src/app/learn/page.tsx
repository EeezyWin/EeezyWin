'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Navbar, UnitHeader, LessonCard } from '@/components';

export default function LearnPage() {
  const router = useRouter();
  const { user, isAuthenticated, courses } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentCourse = courses.find((c) => c.id === user.currentCourseId) || courses[0];

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <main className="pt-16 pb-20 md:pb-4 md:pl-64">
        <div className="max-w-2xl mx-auto p-4">
          {/* Course Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{currentCourse.flag}</span>
            <div>
              <h1 className="text-2xl font-bold">{currentCourse.name}</h1>
              <p className="text-gray-500 text-sm">
                {currentCourse.fromLanguage} → {currentCourse.toLanguage}
              </p>
            </div>
          </div>

          {/* Units and Lessons */}
          <div className="space-y-8">
            {currentCourse.units.map((unit, unitIndex) => (
              <div key={unit.id}>
                <UnitHeader unit={unit} index={unitIndex} />

                {/* Lessons Path */}
                <div className="flex flex-col items-center gap-6 py-4">
                  {unit.lessons.map((lesson, lessonIndex) => {
                    // Create a zigzag pattern
                    const offset = lessonIndex % 2 === 0 ? -40 : 40;
                    return (
                      <div
                        key={lesson.id}
                        style={{ marginLeft: `${offset}px` }}
                        className="relative"
                      >
                        {/* Connecting line */}
                        {lessonIndex < unit.lessons.length - 1 && (
                          <div
                            className="absolute top-full left-1/2 w-1 h-6 bg-gray-200 -translate-x-1/2"
                            style={{
                              transform: `translateX(-50%) rotate(${lessonIndex % 2 === 0 ? 30 : -30}deg)`,
                              transformOrigin: 'top center',
                            }}
                          />
                        )}
                        <LessonCard
                          lesson={lesson}
                          courseId={currentCourse.id}
                          unitIndex={unitIndex}
                          lessonIndex={lessonIndex}
                          onClick={() => handleLessonClick(lesson.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
