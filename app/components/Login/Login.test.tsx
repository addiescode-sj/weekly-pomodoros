import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

// axios mock에 대한 타입 정의
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  window.localStorage.removeItem("token");
});

test("allows the user to login successfully", async () => {
  const fakeUserResponse = { token: "fake_user_token" };
  const response = { data: fakeUserResponse };
  mockedAxios.post.mockResolvedValue(response);

  render(<Login />);

  // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "chuck" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "norris" },
  });

  fireEvent.click(screen.getByText(/submit/i));

  // just like a manual tester, we'll instruct our test to wait for the alert
  // to show up before continuing with our assertions.
  const alert = await screen.findByRole("alert");

  // .toHaveTextContent() comes from jest-dom's assertions
  // otherwise you could use expect(alert.textContent).toMatch(/congrats/i)
  // but jest-dom will give you better error messages which is why it's recommended
  expect(alert).toHaveTextContent(/congrats/i);
  expect(window.localStorage.getItem("token")).toEqual(fakeUserResponse.token);
});

test("disallows the user when username or password is incorrect", async () => {
  mockedAxios.post.mockImplementation((url: string, data?: unknown) => {
    const body = data as { username: string; password: string };
    if (body.username === "chuck" && body.password === "norris") {
      const fakeUserResponse = { token: "fake_user_token" };
      const response = { data: fakeUserResponse };
      return Promise.resolve(response);
    } else {
      return Promise.reject({ message: "Unauthorized", status: 401 });
    }
  });

  render(<Login />);

  // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "invalid username" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "norris" },
  });

  fireEvent.click(screen.getByText(/submit/i));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/unauthorized/i);
  expect(window.localStorage.getItem("token")).toBeNull();
});

test("handles server exceptions", async () => {
  const response = { message: "Internal server error", status: 500 };
  mockedAxios.post.mockRejectedValue(response);

  render(<Login />);

  // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "chuck" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "norris" },
  });

  fireEvent.click(screen.getByText(/submit/i));

  // wait for the error message
  const alert = await screen.findByRole("alert");

  expect(alert).toHaveTextContent(/internal server error/i);
  expect(window.localStorage.getItem("token")).toBeNull();
});
