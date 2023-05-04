import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLoginContext } from '.';
import useLoading from 'hooks/useLoading';

/**
 * Validates user is authenticated and has permission to access the requested page.
 *
 * Renders the page if the user is allowed to access it.
 *
 * Redirects to Login page if user is not authenticated.
 *
 * Redirects to Error page if user is authenticated but is not allowed to access the page.
 *
 * @param {Element} Component Page to be rendered if access is allowed.
 * @param {string[]} roles Array of allowed roles. All roles are allowed if not present.
 */
const withAuth = (Component, roles = []) =>
  function AuthWrapper(props) {
    const { loading, isLoggedIn, user, refreshUser, loaded } =
      useLoginContext();
    const { hideLoadingSpinner, Loading } = useLoading(true);
    const router = useRouter();
    useEffect(() => {
      // Try to fetch user from previous session.
      const refresh = async () => {
        if (!isLoggedIn) {
          await refreshUser();
          loaded();
        }
      };
      refresh();
    }, []);

    useEffect(() => {
      if (!loading) {
        hideLoadingSpinner();
        // Redirect to login page if user is not logged in.
        if (!isLoggedIn) router.push('/auth/login');
      }
    }, [loading]);

    // Check if user is allowed to access the current page.
    if (isLoggedIn && roles.length && !roles.includes(user.userType)) {
      router.push('/not-found');
      return;
    }

    if (loading) return <Loading />;
    return isLoggedIn && <Component {...props} />;
  };

export default withAuth;
