# Overview

The purpose of this document is to keep an inventory of things to be done

# Order not relevant

- Add pre-commit hooks for
  - frontend
    - ~~linting~~
    - ~~format~~
  - backend
    - linting
    - format
  - ~~line endings~~
  - ~~trailing whitespace~~
- ~~Associate CodeRabbit with this repository~~
- Define pipeline and add
  - frontend
    - ~~build command~~
    - ~~tests run~~
    - ~~format check~~
    - ~~linting check~~
  - backend
    - frontend
    - build command
    - tests run
    - format check
    - linting check

# Order relevant

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
   1. Criterion
      - id
      - title
      - description
      - totalPoints
   1. Assignment
      - id
      - title
      - description
   1. Student
      - id
      - fullName
   1. Submission
      - id
      - studentId
      - assignmentId
   1. Enrollment
      - id
      - studentId
      - courseId
   1. Remove courses from Student

1. Define new data entities to separate data better
   1. Enrollment for student to course
   1. AssignmentGrade for grade to assignment
1. Assignment creation page
   1. Allow the user to navigate back to the course page
   1. Allow the user to name the assignment
