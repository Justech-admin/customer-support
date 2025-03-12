import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    // Check session first
    const session = await getSession({ req: context.req });

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Check token
    const token = await getToken({ req: context.req });

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const tokenName = token?.name;
    const { username } = context.query;

    if (username && username !== tokenName) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // If additional props are needed, call the passed getServerSideProps function
    let pageProps = {};
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      if (result.props) {
        pageProps = result.props;
      }
    }

    return {
      props: {
        ...pageProps,
        tokenName,
      },
    };
  };
}
