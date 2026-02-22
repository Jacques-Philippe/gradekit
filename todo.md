# Overview

The purpose of this document is to keep an inventory of things to be done

# Todo

1. Define AssignmentView page
   1. User can click a course assignment and be redirected to the page of this assignment
   1. User can click the Edit Questions button and be redirected to the Assignment Questions View
   1. User can click back and be brought back to the CourseView page
   1. User can click grade and be brought to the GradeAssignmentsView
1. Define AssignmentQuestionsView page
   1. User is able to press the `New question` button and is brought to the QuestionView page
   1. User is able to press the Question button and be brought to the QuestionView page to edit the question
1. Define GradeAssignmentsView page
   1. TBD

# Done

1. ~~Create Vue.js (TS) frontend~~
1. ~~Add build command to package.json~~
1. ~~Create one frontend unit test and add test command~~
1. ~~Figure out if we want to either~~ We're stubbing the backend!
   - ~~use a fake backend to define the frontend first~~
   - ~~start defining .NET backend now~~
1. ~~Allow the user to create a course~~
1. ~~Home page:~~
   1. ~~Allow the user to select a course from a list of mocked courses~~
   1. ~~On course selection, redirect the user to the course page~~
1. Transition to a SPA
   1. ~~Define UX on Figma~~
   1. ~~Define state diagram~~
   1. ~~Replace existing routing infrastructure with state switching~~
1. Course page:
   1. ~~There should be a home button that takes the user back to the home page~~
   1. Display course information
      - ~~Course name~~
   1. ~~Allow the user to navigate to the `assignment creation page` given they press a button~~
   1. ~~Allow the user to navigate to the `course students page` given they press another button~~
1. ~~Course students page~~
   1. ~~Allow the user to define a new student to be associated to the course~~

1. Define data types for
   1. Student
      - id
      - fullName
   1. Course
      - id
      - name
      - description?
   1. Criterion
      - id
      - title
      - description
      - totalPoints
   1. Assignment
      - courseId
      - id
      - title
      - description
   1. Submission
      - id
      - studentId
      - assignmentId
   1. Enrollment
      - id
      - studentId
      - courseId
   1. AssignmentQuestion
      - id
      - assignmentId
      - questionText
   1. AssignmentCriteria
      - id
      - assignmentId
      - criterionId
   1. QuestionResponse // student answer per question
      - id
      - submissionId
      - assignmentQuestionId
      - responseText?
   1. CriterionScore
      - id
      - questionResponseId
      - criterionId
      - pointsAwarded
      - feedback?
   1. Remove courses from Student

1. Define new data entities to separate data better
   1. ~~Enrollment for student to course~~
   1. ~~Submission for grade to assignment~~
1. Assignment creation page
   1. ~~Allow the user to navigate back to the course page~~
   1. ~~Allow the user to name the assignment~~
