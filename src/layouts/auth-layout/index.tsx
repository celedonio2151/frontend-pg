import { type PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div>
			<div>{children}</div>
		</div>
	);
}
