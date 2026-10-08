import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, message: "" };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Something went wrong.",
    };
  }
  componentDidCatch(error) {
    console.error("MindRush render error:", error);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7faff] p-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0f2] text-2xl">
            !
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[#142b62]">
            MindRush couldn't load this page
          </h1>
          <p className="mt-3 text-[#6a81b4]">{this.state.message}</p>
          <button
            className="primary-btn mt-6"
            onClick={() => window.location.reload()}
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }
}
