import React, { useEffect, useContext, useCallback } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { RequestContext } from "../../CONTAINERs/request/container";

const GoogleLoginButton = () => {
  const { auth_oauth } = useContext(RequestContext);

  const handleGoogleResponse = useCallback((response) => {
    if (response.credential) {
      // Send the credential to our backend
      auth_oauth('google', { credential: response.credential });
    }
  }, [auth_oauth]);

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
          callback: handleGoogleResponse,
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [handleGoogleResponse]);

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleGoogleLogin}
      fullWidth
      sx={{
        borderRadius: "10px",
        fontFamily: "Jost",
        fontSize: "16px",
        textTransform: "none",
        borderColor: "#dadce0",
        color: "#3c4043",
        backgroundColor: "#ffffff",
        "&:hover": {
          backgroundColor: "#f8f9fa",
          borderColor: "#dadce0",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "12px 16px",
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: 18, height: 18 }}
      />
      Continue with Google
    </Button>
  );
};

const AppleLoginButton = () => {
  const { auth_oauth } = useContext(RequestContext);

  useEffect(() => {
    // Load Apple ID Services
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: process.env.REACT_APP_APPLE_CLIENT_ID || 'your-apple-client-id',
          scope: 'name email',
          redirectURI: window.location.origin,
          usePopup: true,
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [auth_oauth]);

  const handleAppleLogin = async () => {
    try {
      if (window.AppleID) {
        const response = await window.AppleID.auth.signIn();
        if (response.authorization) {
          // Send the authorization to our backend
          auth_oauth('apple', {
            code: response.authorization.code,
            id_token: response.authorization.id_token,
          });
        }
      }
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleAppleLogin}
      fullWidth
      sx={{
        borderRadius: "10px",
        fontFamily: "Jost",
        fontSize: "16px",
        textTransform: "none",
        borderColor: "#000000",
        color: "#ffffff",
        backgroundColor: "#000000",
        "&:hover": {
          backgroundColor: "#333333",
          borderColor: "#333333",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "12px 16px",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      Continue with Apple
    </Button>
  );
};

const OAuthButtons = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <GoogleLoginButton />
      <AppleLoginButton />
    </Box>
  );
};

export default OAuthButtons;