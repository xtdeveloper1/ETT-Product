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

interface CheckoutContactProps {
  checkoutData: CheckoutFormState;
  setCheckoutData: (data: CheckoutFormState) => void;
}

export default function CheckoutContact({ checkoutData, setCheckoutData }: CheckoutContactProps) {
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
        Contact
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={checkoutData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={checkoutData.phone}
            onChange={handleChange}
            placeholder="+91 7479766602"
            className="w-full h-12 border border-slate-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
