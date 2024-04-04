import { Tooltip } from '@rneui/themed';
import { useEffect } from 'react';
import { useState } from 'react';
import MenuItem from './MenuItem';

function ToolTipCustom({ height, width, backgroundColor, items, borderWidth, children, visible }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [visible]);
    return (
        <Tooltip
            visible={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            containerStyle={{ borderWidth: borderWidth, opacity: 0.9, bottom: 5 }}
            width={width}
            height={height}
            popover={
                <>
                    {items.map((item, index) => (
                        <MenuItem {...item} key={index} />
                    ))}
                </>
            }
            withOverlay={false}
            backgroundColor={backgroundColor}
        >
            {children}
        </Tooltip>
    );
}

export default ToolTipCustom;
