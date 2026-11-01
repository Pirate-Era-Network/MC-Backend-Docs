import React from "react";
import DocSidebarItem from "@theme-original/DocSidebarItem";
import type DocSidebarItemType from "@theme/DocSidebarItem";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof DocSidebarItemType>;

export default function DocSidebarItemWrapper(props: Props): JSX.Element {
    const item = props.item;
    if (item.type !== "category" && item.type !== "link") {
        return <DocSidebarItem {...props} />;
    }
    if (!Object.keys(item.customProps ?? {}).includes("description")) {
        return (
            <>
                <DocSidebarItem {...props} />
            </>
        );
    }
    const { label } = item;
    const description = item.customProps.description as string;
    return (
        <>
            <DocSidebarItem
                {...props}
                item={{
                    ...item,
                    label: (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            {label}
                            <div style={{ fontSize: "0.8em" }}>{description}</div>
                        </div>
                    ),
                }}
            />
        </>
    );
}
