const sampleImages = [
  {
    type: 'High GVP',
    url: '/large_gvp.jpg',
    alt: 'Large pile of garbage showing high level of waste'
  },
  {
    type: 'Medium GVP',
    url: '/medium_gvp.jpg',
    alt: 'Moderate amount of garbage showing medium level of waste'
  },
  {
    type: 'Low GVP',
    url: '/small_gvp.jpg',
    alt: 'Small amount of garbage showing low level of waste'
  }
];

export function SampleImages() {
  return (
    <div className="mt-6 mb-8">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Sample Reference Images
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {sampleImages.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative overflow-hidden rounded-md h-[80px] w-full">
              <img
                src={image.url}
                alt={image.alt}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">{image.type}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">© Images for reference</p>
    </div>
  );
}

export default SampleImages;