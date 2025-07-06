import { clerkClient } from '@clerk/express';

export const protectRoute = async (req, res, next) => {
  //console.log('protectRoute', req?.auth());
  if (!req?.auth()?.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - you must be logged in' });
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    //console.log('hit requireAdmin');
    const currentUser = await clerkClient.users.getUser(req.auth().userId);
    /*
    console.log(
      'requireAdmin,primaryEmailAddress of clerk user:',
      currentUser?.primaryEmailAddress
    );
    const primaryEmailAddressId = currentUser?.primaryEmailAddressId;
    let primaryEmailAddress = null;
    if (primaryEmailAddressId) {
      primaryEmailAddress = currentUser.emailAddresses.find(
        (e) => e.id === primaryEmailAddressId
      )?.emailAddress;
    }
    //console.log('primaryEmailAddress', primaryEmailAddress);
    // console.log(
    //   'requireAdmin.currentUser.primaryEmailAddressId',
    //   currentUser.primaryEmailAddressId
    // );
    // console.log('requireAdmin.email_addresses', currentUser.emailAddresses);
    const isAdmin = process.env.ADMIN_EMAIL === primaryEmailAddress;
*/
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'Unauthorized - you must be an admin' });
    }
    //console.log('isAdmin:', true);
  } catch (error) {
    //console.log('isAdmin:', false);
    //console.log('Error in requireAdmin middleware', error);
    next(error);
  }
  next();
};
