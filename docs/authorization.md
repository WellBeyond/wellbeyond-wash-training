###### Authentication and Authorization

Authentication for end users is done within Firebase.  Users can be authenticated
using an email/password, a phone number (and one time password provided via
text message), or their Google login.  Note that not all authentication types
will work on all platforms:

-  **PWA** - Email, Phone, Google
-  **Android** - Email, Phone
-  **IOS** - Email

Authorization is handled both in the UI and in the `firestore.rules` that 
actually control the database access.



