import jwt from 'jsonwebtoken';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdmV1eWtwZmZyYnl6bWVsdGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNjc1NjIsImV4cCI6MjA5ODc0MzU2Mn0.o2jv7S8cHsMTPCNUPjJcVXweWOKjo3rUcuOZjOqKMRw';
const secret = '3v1RBcs2TfHyKwJMjxF3drgLqcLma4yQahvSIhV9WQyPq+SNKN9V4tumifeDa2cy/m4J3ioyNorBPnYFowNr4w==';

try {
  jwt.verify(anonKey, secret);
  console.log('Valid');
} catch (e: any) {
  console.log('Invalid:', e.message);
}
