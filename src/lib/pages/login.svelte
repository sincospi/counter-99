<script>
  import * as firebaseui from "firebaseui";
  import { auth, onAuthStateChanged, EmailAuthProvider, signOut } from "../firebase/auth";

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  const ui = new firebaseui.auth.AuthUI(auth);

  // Listen to login button clicks
  function toggleLogin() {
      if (auth.currentUser) {
        // User is signed in; allows user to sign out
        signOut(auth);
      } else {
        // No user is signed in; allows user to sign in
        ui.start('#firebaseui-auth-container', uiConfig);
      }
  }

  let loginButtonLabel = 'Login'

  // Listen to the current Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginButtonLabel = 'Logout';
    } else {
      loginButtonLabel = 'Login';
    }
  });
</script>

<div id="login-component">
    <button on:click={() => toggleLogin()}>{loginButtonLabel}</button>
    <section id="firebaseui-auth-container"></section>
</div>