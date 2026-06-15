interface CheckoutFormState {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutShippingProps {
  checkoutData: CheckoutFormState;
  setCheckoutData: (data: CheckoutFormState) => void;
}

export default function CheckoutShipping({ checkoutData, setCheckoutData }: CheckoutShippingProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData({
      ...checkoutData,
      [name]: value,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="font-bold text-base mb-6 text-slate-900">
        Shipping address
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <input
          type="text"
          name="firstName"
          value={checkoutData.firstName}
          onChange={handleChange}
          placeholder="First name"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="lastName"
          value={checkoutData.lastName}
          onChange={handleChange}
          placeholder="Last name"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="address"
          value={checkoutData.address}
          onChange={handleChange}
          placeholder="House no, street, area"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
        />

        <input
          type="text"
          name="city"
          value={checkoutData.city}
          onChange={handleChange}
          placeholder="City"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="state"
          value={checkoutData.state}
          onChange={handleChange}
          placeholder="State"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="pincode"
          value={checkoutData.pincode}
          onChange={handleChange}
          placeholder="PIN code"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="GSTIN (optional)"
          className="h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
        />

      </div>
    </div>
  );
}
