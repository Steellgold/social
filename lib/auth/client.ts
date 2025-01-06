import { passkeyClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const client = createAuthClient({
  plugins: [passkeyClient(), usernameClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    }
  }
});

export const {
  signUp,
  signIn,
  signOut,

  useSession,

  forgetPassword,
  resetPassword,

  passkey,
  useListPasskeys,

  sendVerificationEmail,
  verifyEmail
} = client;