import asyncHandler from '../middleware/asyncHandler.js';
import Address from '../models/Address.js';
import User from '../models/User.js';

export const getAddresss = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json(addresses);
});

export const createAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, country, state, city, zipCode, addressLine1, addressLine2, landmark, isDefault } = req.body;
  
  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    country,
    state,
    city,
    zipCode,
    addressLine1,
    addressLine2,
    landmark,
    isDefault
  });

  // Push to user's addresses array
  const user = await User.findById(req.user._id);
  user.addresses.push(address._id);
  await user.save();

  res.status(201).json(address);
});

export const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (address && address.user.toString() === req.user._id.toString()) {
    res.status(200).json(address);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.toString() === req.user._id.toString()) {
    const { fullName, phone, country, state, city, zipCode, addressLine1, addressLine2, landmark, isDefault } = req.body;

    if (isDefault && !address.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.country = country || address.country;
    address.state = state || address.state;
    address.city = city || address.city;
    address.zipCode = zipCode || address.zipCode;
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 !== undefined ? addressLine2 : address.addressLine2;
    address.landmark = landmark !== undefined ? landmark : address.landmark;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    const updatedAddress = await address.save();
    res.status(200).json(updatedAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.toString() === req.user._id.toString()) {
    await Address.deleteOne({ _id: address._id });
    
    // Remove from user's addresses array
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((addr) => addr.toString() !== address._id.toString());
    await user.save();

    res.status(200).json({ message: 'Address removed' });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

export const updateDefault = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (address && address.user.toString() === req.user._id.toString()) {
    // Set all other addresses to false
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    
    address.isDefault = true;
    const updatedAddress = await address.save();
    
    res.status(200).json(updatedAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});
