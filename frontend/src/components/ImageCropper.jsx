import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

const ImageCropper = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 300, height: 200 });
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const ASPECT_RATIO = 3 / 2;

    useEffect(() => {
        if (imageSrc && isOpen) {
            const img = new Image();
            img.onload = () => {
                const containerWidth = 1000; // Based on max-w-5xl
                const containerHeight = 500; // Based on minHeight

                const scale = Math.min(
                    (containerWidth - 40) / img.naturalWidth,
                    (containerHeight - 40) / img.naturalHeight,
                    1
                );
                
                const width = img.naturalWidth * scale;
                const height = img.naturalHeight * scale;
                setImageSize({ width, height });

                const offsetX = (containerWidth - width) / 2;
                const offsetY = (containerHeight - height) / 2;
                setImageOffset({ x: offsetX, y: offsetY });

                // Initial crop
                const cropWidth = Math.min(width * 0.8, 300);
                const cropHeight = cropWidth / ASPECT_RATIO;
                
                setCrop({
                    x: (width - cropWidth) / 2,
                    y: (height - cropHeight) / 2,
                    width: cropWidth,
                    height: cropHeight
                });
            };
            img.src = imageSrc;
        }
    }, [imageSrc, isOpen]);

    const handleCropMouseDown = (e) => {
        setDragging(true);
        // Store the initial click position relative to the crop box top-left
        setDragStart({
            x: e.clientX - crop.x,
            y: e.clientY - crop.y
        });
    };

    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        setResizing(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!dragging && !resizing) return;

        if (dragging) {
            let newX = e.clientX - dragStart.x;
            let newY = e.clientY - dragStart.y;

            // Constraints
            newX = Math.max(0, Math.min(newX, imageSize.width - crop.width));
            newY = Math.max(0, Math.min(newY, imageSize.height - crop.height));

            setCrop(prev => ({ ...prev, x: newX, y: newY }));
        } 
        
        else if (resizing) {
            const deltaX = e.clientX - dragStart.x;
            let newWidth = crop.width + deltaX;
            let newHeight = newWidth / ASPECT_RATIO;

            // Bounds check
            if (newWidth + crop.x > imageSize.width) {
                newWidth = imageSize.width - crop.x;
                newHeight = newWidth / ASPECT_RATIO;
            }
            if (newHeight + crop.y > imageSize.height) {
                newHeight = imageSize.height - crop.y;
                newWidth = newHeight * ASPECT_RATIO;
            }

            if (newWidth > 50) { // Min size
                setCrop(prev => ({ ...prev, width: newWidth, height: newHeight }));
                setDragStart({ x: e.clientX, y: e.clientY });
            }
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
    };

    const handleCrop = () => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // CRITICAL: Calculate scale based on NATURAL size vs DISPLAYED size
            const scaleX = img.naturalWidth / imageSize.width;
            const scaleY = img.naturalHeight / imageSize.height;

            canvas.width = 1200; // Desired output width
            canvas.height = 800;

            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0, 0, 1200, 800
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'cropped-thumbnail.jpg', { type: 'image/jpeg' });
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    onCropComplete(file, dataUrl);
                    onClose();
                }
            }, 'image/jpeg', 0.9);
        };
        img.src = imageSrc;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Adjust Thumbnail</DialogTitle>
                </DialogHeader>
                
                <div 
                    ref={containerRef}
                    className="relative flex items-center justify-center bg-black/5 rounded-lg overflow-hidden select-none"
                    style={{ height: '500px' }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {imageSrc && (
                        <div style={{ 
                            position: 'relative', 
                            width: imageSize.width, 
                            height: imageSize.height 
                        }}>
                            <img
                                src={imageSrc}
                                alt="Source"
                                draggable={false}
                                style={{ width: '100%', height: '100%' }}
                            />
                            
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Transparent Crop Area */}
                            <div
                                onMouseDown={handleCropMouseDown}
                                className="absolute border-2 border-white cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                                style={{
                                    left: crop.x,
                                    top: crop.y,
                                    width: crop.width,
                                    height: crop.height,
                                }}
                            >
                                {/* Grid lines */}
                                <div className="grid grid-cols-3 grid-rows-3 h-full w-full opacity-30 pointer-events-none">
                                    {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-white" />)}
                                </div>

                                {/* Resize Handle */}
                                <div
                                    onMouseDown={handleResizeMouseDown}
                                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full cursor-se-resize z-10"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCrop}>Save Thumbnail</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCropper;