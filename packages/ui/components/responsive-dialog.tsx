import {
  Dialog,
  DialogClose,
  DialogCloseWrapper,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@feedbase/ui/components/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@feedbase/ui/components/drawer';
import useMediaQuery from '@feedbase/ui/lib/hooks/use-media-query';

const ResponsiveDialog: React.FC<
  React.ComponentProps<typeof Dialog> | React.ComponentProps<typeof Drawer>
> = (props) => {
  return useMediaQuery().isMobile ? <Drawer {...props} /> : <Dialog {...props} />;
};

const ResponsiveDialogTrigger: React.FC<React.ComponentProps<typeof DialogTrigger>> = (props) => {
  return useMediaQuery().isMobile ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />;
};

const ResponsiveDialogHeader: React.FC<React.ComponentProps<typeof DialogHeader>> = (props) => {
  return useMediaQuery().isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
};

const ResponsiveDialogTitle: React.FC<React.ComponentProps<typeof DialogTitle>> = (props) => {
  return useMediaQuery().isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
};

const ResponsiveDialogDescription: React.FC<React.ComponentProps<typeof DialogDescription>> = (props) => {
  return useMediaQuery().isMobile ? <DrawerDescription {...props} /> : <DialogDescription {...props} />;
};

const ResponsiveDialogFooter: React.FC<React.ComponentProps<typeof DialogFooter>> = (props) => {
  const { isPWA, isMobile } = useMediaQuery();
  return isMobile ? (
    <DrawerFooter {...props} style={{ paddingBottom: isPWA ? '40px' : undefined }} />
  ) : (
    <DialogFooter {...props} />
  );
};

const ResponsiveDialogContent: React.FC<
  React.ComponentProps<typeof DialogContent> | React.ComponentProps<typeof DrawerContent>
> = (props) => {
  const { onAnimationEnd, ...rest } = props as React.ComponentProps<typeof DialogContent> &
    React.ComponentProps<typeof DrawerContent>;
  return useMediaQuery().isMobile ? <DrawerContent {...rest} /> : <DialogContent {...rest} />;
};

const ResponsiveDialogClose: React.FC<
  | React.ComponentProps<typeof DialogCloseWrapper>
  | (React.ComponentProps<typeof DrawerClose> & { hideCloseButton?: boolean })
> = (props) => {
  const { hideCloseButton, ...rest } = props as { hideCloseButton?: boolean };
  return useMediaQuery().isMobile ? (
    <DrawerClose {...rest} asChild />
  ) : (
    <>
      <DialogCloseWrapper {...rest} />
      {!hideCloseButton && <DialogClose />}
    </>
  );
};

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogContent,
  ResponsiveDialogClose,
};
