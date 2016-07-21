class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, :rememberable, :trackable, :omniauth_providers => [:twitchtv]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.name = auth.info.name
      user.email = auth.info.email
      user.image = auth.info.image
    end
  end
end
